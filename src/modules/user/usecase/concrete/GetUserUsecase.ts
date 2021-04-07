import { User } from '../../entities/User';
import { IGetUserRepository } from '../../repository/interface/IGetUserRepository';
import { IGetUserUsecase } from '../interface/IGetUserUsecase';

export class GetUserUsecase implements IGetUserUsecase {
	constructor(private readonly getUserRepository: IGetUserRepository) {}

	async get(name: string): Promise<User> {
		return await this.getUserRepository.get(name);
	}
}
