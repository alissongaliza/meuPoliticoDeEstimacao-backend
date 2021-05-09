import { PoliticiansIdAndTheme } from '../../../entities/DTO';

export interface IListRelevantPoliticiansByThemeRepository {
	listRelevantPoliticiansByTheme(id: string): Promise<PoliticiansIdAndTheme>;
}
