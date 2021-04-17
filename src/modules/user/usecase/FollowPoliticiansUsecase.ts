import { Followee } from '../entities/DTO';
import { IFollowManyPoliticiansRepository } from '../repository/interface/IFollowManyPoliticiansRepository';
import { IFollowSinglePoliticianRepository } from '../repository/interface/IFollowSinglePoliticianRepository';

export class FollowPoliticiansUsecase {
	constructor(
		private readonly followManyPoliticiansRepository: IFollowManyPoliticiansRepository,
		private readonly followSinglePoliticianRepository: IFollowSinglePoliticianRepository
	) {}

	async followPoliticians(userName: string, followees: Followee[]): Promise<boolean> {
		return await (followees.length === 1
			? this.followSinglePoliticianRepository.followSinglePolitician(userName, followees[0])
			: this.followManyPoliticiansRepository.followManyPoliticians(userName, followees));
	}
}
