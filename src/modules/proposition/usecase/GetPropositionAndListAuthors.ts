import { Proposition } from '../entities/Proposition';
import { IGetPropositionAndListAuthorsRepository } from '../repository/interface/IGetPropositionAndListAuthorsRepository';

export class GetPropositionAndListAuthorsUsecase {
	constructor(private readonly getPropositionAndListAuthorsRepository: IGetPropositionAndListAuthorsRepository) {}

	async getPropositionAndListAuthors(propositionId: string): Promise<Proposition> {
		return await this.getPropositionAndListAuthorsRepository.getPropositionAndListAuthors(propositionId);
	}
}
