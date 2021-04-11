import { Theme } from '../entities/Theme';
import { IGetThemeAndNewestPropositionsRepository } from '../repository/interface/IGetThemeAndNewestPropositionsRepository';

export class GetThemeAndNewestPropositionsUsecase {
	constructor(private readonly getThemeAndNewestPropositionsRepository: IGetThemeAndNewestPropositionsRepository) {}

	async getThemeAndNewestPropositions(themeId: string): Promise<Theme> {
		return await this.getThemeAndNewestPropositionsRepository.getThemeAndNewestPropositions(themeId);
	}
}
