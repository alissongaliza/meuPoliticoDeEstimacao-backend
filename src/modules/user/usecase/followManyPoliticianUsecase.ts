import { Followee } from '../entities/DTO';
import { IFollowManyPoliticianRepository } from '../repository/interface/IFollowManyPoliticianRepository';

export class FollowManyPoliticianUsecase {
	constructor(private readonly followManyPoliticianRepository: IFollowManyPoliticianRepository) {}

	async followManyPolitician(userName: string, followees: Followee[]): Promise<boolean> {
		return await this.followManyPoliticianRepository.followManyPolitician(userName, followees);
	}
}
