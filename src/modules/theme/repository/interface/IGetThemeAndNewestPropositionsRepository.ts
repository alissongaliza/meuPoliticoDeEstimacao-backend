import { Theme } from '../../entities/Theme';

export interface IGetThemeAndNewestPropositionsRepository {
	getThemeAndNewestPropositions(id: string): Promise<Theme>;
}
