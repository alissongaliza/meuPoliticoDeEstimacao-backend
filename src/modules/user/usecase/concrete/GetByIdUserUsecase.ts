import { User } from '../../entities/User';
import { IGetByIdUserRepository } from '../../repository/interface/IGetByIdUserRepository';
import { IGetByIdUserUsecase } from '../interface/IGetByIdUserUsecase';

export class GetByIdUserUsecase implements IGetByIdUserUsecase {
	constructor(private readonly getByIdUserRepository: IGetByIdUserRepository) {}

	async getById(id: string): Promise<User> {
		const user = await this.getByIdUserRepository.getById(id);
		return user;
	}
}
