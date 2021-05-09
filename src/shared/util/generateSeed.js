/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-absolute-path */

require('dotenv').config();
const _range = require('lodash/range');
const _flatten = require('lodash/flatten');
const fetch = require('node-fetch');

const earliestYear = 2020;
const latestYear = 2021;
const fullSeedPath = `${process.env.BASE_PROJECT_PATH}/src/shared/infra/dynamodb/newSeed.json`;
const miniSeedPath = `${process.env.BASE_PROJECT_PATH}/src/shared/infra/dynamodb/miniSeed.json`;
const validPropositionsHash = {};

function getPropositions(year) {
	let { dados: propositions } = require(`${process.env.SOURCE_FILES_PATH}/proposicoes-${year}`);
	return propositions
		.filter((el) => el.codTipo == '136' || el.codTipo == '139')
		.map((proposition) => {
			const { uri = '', ementa = '', keywords = [], id } = proposition;
			validPropositionsHash[id + ''] = [];
			const rawNonEmptyTags = keywords.split(',').filter(Boolean);
			const tags = rawNonEmptyTags.map((el) => el.trim());
			if (tags.length > 0) tags[tags.length - 1] = tags[tags.length - 1].substring(0, tags.length - 1);
			return {
				PK: `PROPOSITION#${id}`,
				SK: `PROPOSITION#${id}`,
				uri,
				ementa,
				id,
				tags,
			};
		});
}

function getPropositionsAndThemes(year) {
	let { dados: propositionsAndThemes } = require(`${process.env.SOURCE_FILES_PATH}/proposicoesTemas-${year}`);
	return propositionsAndThemes
		.filter(({ uriProposicao }) => !!validPropositionsHash[uriProposicao.split('proposicoes/')[1] + ''])
		.map(({ codTema, uriProposicao }) => {
			const propositionId = uriProposicao.split('proposicoes/')[1];
			validPropositionsHash[propositionId + ''].push(codTema + '');
			return {
				PK: `PROPOSITION#${propositionId}`,
				SK: `THEME#${codTema}`,
				GSI1PK: `THEME#${codTema}`,
				GSI1SK: `#PROPOSITION#${propositionId}`,
				themeId: codTema + '',
				propositionId,
			};
		});
}

function getAuthorsPropositions(year) {
	const { dados: propositionsAuthors } = require(`${process.env.SOURCE_FILES_PATH}/proposicoesAutores-${year}`);
	return propositionsAuthors
		.filter((el) => el.idDeputadoAutor !== undefined && !!validPropositionsHash[el.idProposicao + ''])
		.map(({ idProposicao, idDeputadoAutor, nomeAutor }) => ({
			PK: `PROPOSITION#${idProposicao}`,
			SK: `POLITICIAN#${idDeputadoAutor}`,
			politicianId: idDeputadoAutor + '',
			propositionId: idProposicao + '',
			authorName: nomeAutor,
		}));
}

function getAuthorsThemesTrackHash(propositionsAuthors) {
	const authorsThemesTrackHash = {};
	propositionsAuthors.map(({ propositionId, politicianId, authorName }) => {
		const themes = validPropositionsHash[propositionId + ''] || [];
		return themes.map((themeId) => {
			const key = `THEME#${themeId}POLITICIAN#${politicianId}`;
			const count = (authorsThemesTrackHash[key] && authorsThemesTrackHash[key].count + 1) || 1;
			const paddedCount = count.toString().padStart(5, '0');
			authorsThemesTrackHash[key] = {
				PK: `THEME#${themeId}`,
				SK: `POLITICIAN#${politicianId}`,
				themeId,
				authorId: politicianId,
				count,
				GSI1PK: `THEME#${themeId}`,
				GSI1SK: `z${paddedCount}POLITICIAN#${politicianId}`,
				authorName,
			};
		});
	});
	return authorsThemesTrackHash;
}

function getAllThemes(themes) {
	let allThemes = themes.reduce((acc, { cod: id, nome: name }) => {
		return { ...acc, [id]: { id, name, count: 0 } };
	}, {});
	return { themes: { ...allThemes }, PK: 'THEMES', SK: 'THEMES' };
}

function getFormattedThemes(themes) {
	return themes.map((theme) => {
		const { cod, nome: name } = theme;
		return {
			PK: `THEME#${cod}`,
			SK: `THEME#${cod}`,
			name,
			GSI1PK: `THEME#${cod}`,
			GSI1SK: `THEME#${cod}`,
			id: cod,
		};
	});
}

async function getPoliticians() {
	let { dados: politicians } = require(`${process.env.SOURCE_FILES_PATH}/deputados`);

	politicians = politicians.reduce((acc, politician) => {
		const id = politician.uri.split('deputados/')[1] != undefined ? politician.uri.split('deputados/')[1] : '-1';
		return {
			...acc,
			[id]: {
				civilName: politician.nomeCivil,
				gender: politician.siglaSexo,
				bornOn: politician.dataNascimento,
				diedOn: politician.dataFalecimento,
				socialMedia: politician.urlRedeSocial,
				urlWebsite: politician.website,
				stateOfBirth: politician.ufNascimento,
				cityOfBirth: politician.municipioNascimento,
			},
		};
	}, {});
	let apiPoliticians = [];
	let link = `https://dadosabertos.camara.leg.br/api/v2/deputados?dataInicio=1930-01-01&ordem=ASC&ordenarPor=nome`;
	while (link) {
		const { dados: data, links } = await fetch(link).then((response) => response.json());
		const next = links.find((el) => el.rel === 'next');
		link = next && next.href;
		apiPoliticians.push(data);
	}
	apiPoliticians = _flatten(apiPoliticians);

	return apiPoliticians.map((pol) => {
		const generalPoliticianData = politicians[pol.id] || {};
		return {
			...generalPoliticianData,
			PK: `POLITICIAN#${pol.id}`,
			SK: `POLITICIAN#${pol.id}`,
			followersCount: 0,
			id: pol.id,
			name: generalPoliticianData.name || pol.nome,
			uri: pol.uri,
			partyCode: pol.siglaPartido,
			partyUri: pol.uriPartido,
			stateCode: pol.siglaUf,
			photoUrl: pol.urlFoto,
			email: pol.email,
		};
	});
}

async function getThemes() {
	const response = await fetch(
		'https://dadosabertos.camara.leg.br/api/v2/referencias/proposicoes/codTema'
	).then((response) => response.json());
	return response.dados;
}

const getAllData = async () => {
	const data = _range(earliestYear, latestYear).map((year) => {
		const propositions = getPropositions(year);

		const propositionsAndThemes = getPropositionsAndThemes(year);

		const authorsPropositions = getAuthorsPropositions(year);

		const authorsThemesTrackHash = getAuthorsThemesTrackHash(authorsPropositions);

		const authorsAndThemes = Object.values(authorsThemesTrackHash);

		return [propositions, propositionsAndThemes, authorsPropositions, authorsAndThemes];
	});

	const flattenData = _flatten(data);
	const themes = await getThemes();
	const allThemes = getAllThemes(themes);
	flattenData.push([allThemes]);
	const formattedThemes = getFormattedThemes(themes);
	flattenData.push(formattedThemes);
	const politicians = await getPoliticians();
	flattenData.push(politicians);
	return flattenData;
};
async function generateFullSeed() {
	const data = await getAllData();
	const flattenData = _flatten(data);
	writeToFile(flattenData, fullSeedPath);
}

async function generateMiniSeed() {
	const data = await getAllData();
	const miniData = data.map((el) => el.slice(0, 5));
	const miniFlattenData = _flatten(miniData);
	writeToFile(miniFlattenData, miniSeedPath);
}

async function generateBothSeeds() {
	const data = await getAllData();
	const flattenData = _flatten(data);
	writeToFile(flattenData, fullSeedPath);
	const miniData = data.map((el) => el.slice(0, 5));
	const miniFlattenData = _flatten(miniData);
	writeToFile(miniFlattenData, miniSeedPath);
}

function writeToFile(data, path) {
	const fs = require('fs');
	try {
		fs.writeFile(path, JSON.stringify(data, null, 4), (err, result) => {
			if (err) console.info(err);
		});
	} catch (err) {
		console.error(err);
	}
}

// generateFullSeed();
// generateMiniSeed();
generateBothSeeds();
