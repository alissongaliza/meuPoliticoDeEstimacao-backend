import { CreateUserDTO } from '../entities/DTO';
import { ICreateUserRepository } from '../repository/interface/ICreateUserRepository';

export class CreateUserUsecase {
	constructor(private readonly createUserRepository: ICreateUserRepository) {}

	async create(data: CreateUserDTO): Promise<boolean> {
		return await this.createUserRepository.create(data);
	}
}
