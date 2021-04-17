import { Followee } from '../entities/DTO';
import { IFollowPoliticiansRepository } from '../repository/interface/IFollowPoliticiansRepository';

export class FollowPoliticiansUsecase {
	constructor(private readonly followPoliticiansRepository: IFollowPoliticiansRepository) {}

	async followPoliticians(userName: string, followees: Followee[]): Promise<boolean> {
		return await this.followPoliticiansRepository.followPoliticians(userName, followees);
	}
}
