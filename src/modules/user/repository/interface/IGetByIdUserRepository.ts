import { User } from '../../entities/User';

export interface IGetByIdUserRepository {
	getById(id: string): Promise<User>;
}
