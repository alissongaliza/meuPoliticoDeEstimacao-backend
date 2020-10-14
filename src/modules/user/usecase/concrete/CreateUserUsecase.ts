import { User } from '../../entities/User';
import { CreateUserDTO } from '../../entities/UserDTO';
import { ICreateUserRepository } from '../../repository/interface/ICreateUserRepository';
import { IGetByIdUserRepository } from '../../repository/interface/IGetByIdUserRepository';
import { ICreateUserUsecase } from '../interface/ICreateUserUsecase';

export class CreateUserUsecase implements ICreateUserUsecase {
	constructor(
		private readonly createUserRepository: ICreateUserRepository,
		private readonly getByIdUserRepository: IGetByIdUserRepository
	) {}

	async create(data: CreateUserDTO): Promise<User> {
		const generatedId = await this.createUserRepository.create(data);
		return await this.getByIdUserRepository.getById(generatedId);
	}
}
