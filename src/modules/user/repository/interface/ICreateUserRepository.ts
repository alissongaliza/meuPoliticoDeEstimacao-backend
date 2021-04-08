import { CreateUserDTO } from '../../entities/UserDTO';

export interface ICreateUserRepository {
	create(data: CreateUserDTO): Promise<boolean>;
}
