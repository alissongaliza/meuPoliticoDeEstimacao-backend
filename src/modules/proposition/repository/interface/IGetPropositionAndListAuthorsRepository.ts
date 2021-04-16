import { Proposition } from '../../entities/Proposition';

export interface IGetPropositionAndListAuthorsRepository {
	getPropositionAndListAuthors(id: string): Promise<Proposition>;
}
