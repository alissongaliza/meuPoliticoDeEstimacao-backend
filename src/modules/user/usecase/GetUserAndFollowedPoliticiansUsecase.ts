import { User } from '../entities/User';
import { IGetUserAndFollowedPoliticiansRepository } from '../repository/interface/IGetUserAndFollowedPoliticiansRepository';

export class GetUserAndFollowedPoliticiansUsecase {
	constructor(private readonly getUserAndFollowedPoliticiansRepository: IGetUserAndFollowedPoliticiansRepository) {}

	async get(name: string): Promise<User> {
		return await this.getUserAndFollowedPoliticiansRepository.getUserAndFollowedPoliticians(name);
	}
}
