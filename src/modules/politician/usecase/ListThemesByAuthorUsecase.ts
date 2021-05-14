import { ListThemesByAuthorDTO } from '../entities/DTO';
import { IListThemesByAuthorRepository } from '../repository/concrete/interface/IListThemesByAuthorRepository';

export class ListThemesByAuthorUsecase {
	constructor(private readonly listThemesByAuthorRepository: IListThemesByAuthorRepository) {}

	async listThemesByAuthor(authorId: string): Promise<ListThemesByAuthorDTO[]> {
		return await this.listThemesByAuthorRepository.listThemesByAuthor(authorId);
	}
}
