import { ListPropositionsByAuthorDTO } from '../../../entities/DTO';

export interface IListPropositionByAuthorRepository {
	listPropositionByAuthor(id: string): Promise<ListPropositionsByAuthorDTO[]>;
}
