import { User } from '../../entities/User';
import { UpdateUserDTO } from '../../entities/UserDTO';
import { IGetByIdUserRepository } from '../../repository/interface/IGetByIdUserRepository';
import { IUpdateUserRepository } from '../../repository/interface/IUpdateUserRepository';
import { IUpdateUserUsecase } from '../interface/IUpdateUserUsecase';

export class UpdateUserUsecase implements IUpdateUserUsecase {
	constructor(
		private readonly updateUserRepository: IUpdateUserRepository,
		private readonly getByIdUserRepository: IGetByIdUserRepository
	) {}

	async update(data: UpdateUserDTO): Promise<User> {
		const updated = await this.updateUserRepository.update(data);
		return await this.getByIdUserRepository.getById(data.id);
	}
}
