import { UpdateUserDTO } from '../entities/DTO';
import { IUpdateUserRepository } from '../repository/interface/IUpdateUserRepository';

export class UpdateUserUsecase {
	constructor(private readonly updateUserRepository: IUpdateUserRepository) {}

	async update(data: UpdateUserDTO): Promise<boolean> {
		return await this.updateUserRepository.update(data);
	}
}
