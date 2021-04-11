import { Theme } from '../entities/Theme';
import { IListThemesRepository } from '../repository/interface/IListThemesRepository';

export class ListThemesUsecase {
	constructor(private readonly listThemesRepository: IListThemesRepository) {}

	async listThemes(): Promise<Theme[]> {
		return await this.listThemesRepository.listThemes();
	}
}
