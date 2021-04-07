import { User } from '../../entities/User';

export interface IGetUserUsecase {
	get(name: string): Promise<User>;
}
