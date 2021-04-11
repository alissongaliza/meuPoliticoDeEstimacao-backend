import { User } from '../entities/User';
import { IGetUserRepository } from '../repository/interface/IGetUserRepository';

export class GetUserUsecase {
	constructor(private readonly getUserRepository: IGetUserRepository) {}

	async get(name: string): Promise<User> {
		return await this.getUserRepository.get(name);
	}
}
