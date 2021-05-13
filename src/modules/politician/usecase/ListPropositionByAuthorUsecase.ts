import { ListPropositionsByAuthorDTO } from '../entities/DTO';
import { IListPropositionByAuthorRepository } from '../repository/concrete/interface/IListPropositionByAuthorRepository';

export class ListPropositionByAuthorUsecase {
	constructor(private readonly listPropositionByAuthorRepository: IListPropositionByAuthorRepository) {}

	async listPropositionByAuthor(authorId: string): Promise<ListPropositionsByAuthorDTO[]> {
		return await this.listPropositionByAuthorRepository.listPropositionByAuthor(authorId);
	}
}
