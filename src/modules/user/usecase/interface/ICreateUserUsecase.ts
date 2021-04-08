import { CreateUserDTO } from '../../entities/UserDTO';

export interface ICreateUserUsecase {
	create(data: CreateUserDTO): Promise<boolean>;
}
