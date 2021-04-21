import { Followee } from '../entities/DTO';
import { IFollowManyPoliticiansRepository } from '../repository/interface/IFollowManyPoliticiansRepository';
import { IFollowSinglePoliticianRepository } from '../repository/interface/IFollowSinglePoliticianRepository';

export class FollowPoliticiansUsecase {
	constructor(
		private readonly followManyPoliticiansRepository: IFollowManyPoliticiansRepository,
		private readonly followSinglePoliticianRepository: IFollowSinglePoliticianRepository
	) {}

	async followPoliticians(userName: string, followees: Followee[]): Promise<any[]> {
		if (followees.length === 1) {
			const followed = this.followSinglePoliticianRepository.followSinglePolitician(userName, followees[0]);
			return followed ? [] : [followed];
		} else return this.followManyPoliticiansRepository.followManyPoliticians(userName, followees);
	}
}
