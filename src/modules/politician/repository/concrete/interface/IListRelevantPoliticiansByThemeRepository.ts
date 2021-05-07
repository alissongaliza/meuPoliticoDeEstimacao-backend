import { PoliticianIdAndTheme } from '../../../entities/DTO';

export interface IListRelevantPoliticiansByThemeRepository {
	listRelevantPoliticiansByTheme(id: string): Promise<PoliticianIdAndTheme>;
}
