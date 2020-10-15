import { UpdateUserDTO } from '../../entities/UserDTO';

export interface IUpdateUserRepository {
	update(data: UpdateUserDTO): Promise<boolean>;
}
