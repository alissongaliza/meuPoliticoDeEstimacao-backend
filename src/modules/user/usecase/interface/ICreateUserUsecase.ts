import { User } from '../../entities/User';
import { CreateUserDTO } from '../../entities/UserDTO';

export interface ICreateUserUsecase {
	create(data: CreateUserDTO): Promise<User>;
}
