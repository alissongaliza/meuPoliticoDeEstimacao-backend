import { CreateUserDTO } from '../../entities/DTO';

export interface ICreateUserRepository {
	create(data: CreateUserDTO): Promise<boolean>;
}
