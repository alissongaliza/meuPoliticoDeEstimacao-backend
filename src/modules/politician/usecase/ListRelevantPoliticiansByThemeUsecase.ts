import { PoliticiansIdAndTheme } from '../entities/DTO';
import { IListRelevantPoliticiansByThemeRepository } from '../repository/concrete/interface/IListRelevantPoliticiansByThemeRepository';

export class ListRelevantPoliticiansByThemeUsecase {
	constructor(private readonly listRelevantPoliticiansByThemeRepository: IListRelevantPoliticiansByThemeRepository) {}

	async listRelevantPoliticiansByTheme(themeIds: string[]): Promise<PoliticiansIdAndTheme[]> {
		const promises = themeIds.map((themeId) =>
			this.listRelevantPoliticiansByThemeRepository.listRelevantPoliticiansByTheme(themeId)
		);
		const result = await Promise.all(promises);
		return result;
	}
}
