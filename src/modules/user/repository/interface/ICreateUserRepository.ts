import { User } from '../../entities/User';
import { CreateUserDTO } from '../../entities/UserDTO';

export interface ICreateUserRepository {
	create(data: CreateUserDTO): Promise<User>;
}
