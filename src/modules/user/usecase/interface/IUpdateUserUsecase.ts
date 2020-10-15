import { User } from '../../entities/User';
import { UpdateUserDTO } from '../../entities/UserDTO';

export interface IUpdateUserUsecase {
	update(data: UpdateUserDTO): Promise<User>;
}
