import { IListRelevantPoliticiansByThemeRepository } from '../repository/concrete/interface/IListRelevantPoliticiansByThemeRepository';

export class ListRelevantPoliticiansByThemeUsecase {
	constructor(private readonly listRelevantPoliticiansByThemeRepository: IListRelevantPoliticiansByThemeRepository) {}

	async listRelevantPoliticiansByTheme(themeIds: string[]): Promise<void> {
		const promises = themeIds.map((themeId) =>
			this.listRelevantPoliticiansByThemeRepository.listRelevantPoliticiansByTheme(themeId)
		);
		const result = await Promise.all(promises);
		console.info(result, promises);
		// return {firstTheme:result}
	}
}
