import { RankThemesDTO } from '../entities/DTO';
import { IRankThemesRepository } from '../repository/interface/IRankThemesRepository';

export class RankThemesUsecase {
	constructor(private readonly rankThemesRepository: IRankThemesRepository) {}

	async rankThemes(userId: string, themes: RankThemesDTO): Promise<boolean> {
		return await this.rankThemesRepository.rankThemes(userId, themes);
	}
}
