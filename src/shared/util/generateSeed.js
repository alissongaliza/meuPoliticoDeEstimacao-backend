/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-absolute-path */

require('dotenv').config();
const _range = require('lodash/range');
const _groupBy = require('lodash/groupBy');
const _flatten = require('lodash/flatten');
const fetch = require('node-fetch');

const getData = async () => {
	const data = _range(2015, 2016).map((year) => {
		let { dados: propositions } = require(`${process.env.SOURCE_FILES_PATH}/proposicoes-${year}`);
		propositions = _groupBy(propositions, 'id');
		propositions = Object.keys(propositions).map((id) => {
			const { uri = '', ementa = '', keywords = [] } = propositions[id][0];
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
		let { dados: propositionsTheme } = require(`${process.env.SOURCE_FILES_PATH}/proposicoesTemas-${year}`);
		propositionsTheme = propositionsTheme.map(({ codTema, uriProposicao }) => {
			const propositionId = uriProposicao.split('proposicoes/')[1];
			return {
				PK: `PROPOSITION#${propositionId}`,
				SK: `THEME#${codTema}`,
				GSI1PK: `THEME#${codTema}`,
				GSI1SK: `#PROPOSITION#${propositionId}`,
				themeId: codTema + '',
				propositionId,
			};
		});

		let { dados: propositionsAuthors } = require(`${process.env.SOURCE_FILES_PATH}/proposicoesAutores-${year}`);
		propositionsAuthors = propositionsAuthors
			.filter((el) => el.idDeputadoAutor !== undefined)
			.map(({ idProposicao, idDeputadoAutor }) => ({
				PK: `PROPOSITION#${idProposicao}`,
				SK: `POLITICIAN#${idDeputadoAutor}`,
				politicianId: idProposicao + '',
				propositionId: idDeputadoAutor + '',
			}));

		return [...propositions, ...propositionsTheme, ...propositionsAuthors];
	});

	const flattenData = _flatten(data);

	let themes = await getThemes();
	let allThemes = themes.reduce((acc, { cod: id, nome: name }) => {
		return { ...acc, [id]: { id, name, count: 0 } };
	}, {});
	allThemes = { themes: { ...allThemes }, PK: 'THEMES', SK: 'THEMES' };
	themes
		.map((theme) => {
			const { cod, nome: name } = theme;
			return {
				PK: `THEME#${cod}`,
				SK: `THEME#${cod}`,
				name,
				GSI1PK: `THEME#${cod}`,
				GSI1SK: `THEME#${cod}`,
				id: cod,
			};
		})
		.map((el) => flattenData.push(el));
	flattenData.push(allThemes);

	const politicians = await getPoliticians();
	politicians.map((el) => flattenData.push(el));

	writeToFile(flattenData);
};

async function getThemes() {
	const response = await fetch(
		'https://dadosabertos.camara.leg.br/api/v2/referencias/proposicoes/codTema'
	).then((response) => response.json());
	return response.dados;
}

async function getPoliticians() {
	let { dados: politicians } = require(`${process.env.SOURCE_FILES_PATH}/deputados`);

	politicians = politicians.reduce((acc, politician) => {
		const id = politician.uri.split('deputados/')[1] != undefined ? politician.uri.split('deputados/')[1] : '-1';
		return {
			...acc,
			[id]: {
				name: politician.nomeCivil,
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
	const { dados } = await fetch(
		'https://dadosabertos.camara.leg.br/api/v2/deputados?ordem=ASC&ordenarPor=nome'
	).then((response) => response.json());

	return dados.map((pol) => {
		const generalPoliticianData = politicians[pol.id];
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

function writeToFile(data) {
	const fs = require('fs');
	try {
		fs.writeFile(
			`${process.env.BASE_PROJECT_PATH}/src/shared/infra/dynamodb/newSeed.json`,
			JSON.stringify(data, null, 4),
			(err, result) => {
				if (err) console.info(err);
			}
		);
	} catch (err) {
		console.error(err);
	}
}

getData();
