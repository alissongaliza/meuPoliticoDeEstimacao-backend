import { CreateUserDTO } from '../../entities/UserDTO';
import { ICreateUserRepository } from '../../repository/interface/ICreateUserRepository';
import { ICreateUserUsecase } from '../interface/ICreateUserUsecase';

export class CreateUserUsecase implements ICreateUserUsecase {
	constructor(private readonly createUserRepository: ICreateUserRepository) {}

	async create(data: CreateUserDTO): Promise<boolean> {
		return await this.createUserRepository.create(data);
	}
}
