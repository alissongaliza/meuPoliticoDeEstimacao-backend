/* eslint-disable import/no-absolute-path */
/* eslint-disable @typescript-eslint/no-var-requires */
const _ = require('lodash');

exports.getData = () => {
	let data = [];
	for (const year of _.range(2015, 2021)) {
		let { dados: propositions } = require(`/home/alisson/hdd/Downloads/proposicoes-${year}`);
		propositions = _.groupBy(propositions, 'id');
		propositions = Object.keys(propositions).map((id) => {
			return {
				entity: `PROPOSITION#${id}`,
				data: `METADATA#${id}`,
				uri: propositions[id][0].uri,
				ementa: propositions[id][0].ementa,
			};
		});

		let { dados: propositionsThemes } = require(`/home/alisson/hdd/Downloads/proposicoesTemas-${year}`);
		propositionsThemes = _.groupBy(propositionsThemes, 'codTema');
		const themesMetadata = Object.keys(propositionsThemes).map((codTema) => ({
			entity: `THEME#${codTema}`,
			data: `METADATA#${codTema}`,
			name: propositionsThemes[codTema][0].tema,
		}));
		let themesPropositions = [];
		for (const themeId of Object.keys(propositionsThemes)) {
			const newThemesProp = propositionsThemes[themeId].map(({ uriProposicao }) => ({
				entity: `THEME#${themeId}`,
				data: `PROPOSITION#${uriProposicao.split('proposicoes/')[1]}`,
			}));
			themesPropositions = [...themesPropositions, ...newThemesProp];
		}

		let { dados: politicians } = require(`/home/alisson/hdd/Downloads/proposicoesAutores-${year}`);
		politicians = politicians
			.filter((el) => el.idDeputadoAutor !== undefined)
			.map(({ idProposicao, idDeputadoAutor }) => ({
				entity: `POLITICIAN#${idDeputadoAutor}`,
				data: `PROPOSITION#${idProposicao}`,
			}));

		data = [...data, ...propositions, ...themesPropositions, ...themesMetadata, ...politicians];
	}
	return data;
};
