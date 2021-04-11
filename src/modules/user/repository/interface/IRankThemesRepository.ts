import { RankThemesDTO } from '../../entities/DTO';

export interface IRankThemesRepository {
	rankThemes(userId: string, themes: RankThemesDTO): Promise<boolean>;
}
