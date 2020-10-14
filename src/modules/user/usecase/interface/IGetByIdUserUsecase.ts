import { User } from '../../entities/User';

export interface IGetByIdUserUsecase {
	getById(id: string): Promise<User>;
}
