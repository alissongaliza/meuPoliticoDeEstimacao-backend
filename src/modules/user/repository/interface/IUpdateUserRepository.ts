import { UpdateUserDTO } from '../../entities/DTO';

export interface IUpdateUserRepository {
	update(data: UpdateUserDTO): Promise<boolean>;
}
