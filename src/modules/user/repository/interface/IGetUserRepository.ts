import { User } from '../../entities/User';

export interface IGetUserRepository {
	get(name: string): Promise<User>;
}
