import { Followee } from '../../../entities/DTO';
import { IFollowManyPoliticiansRepository } from '../../interface/IFollowManyPoliticiansRepository';
import { FollowSinglePoliticianRepository } from './FollowSinglePoliticianRepository';

export class FollowManyPoliticiansRepository implements IFollowManyPoliticiansRepository {
	async followManyPoliticians(userName: string, followees: Followee[]): Promise<any[]> {
		const followSinglePoliticianRepository = new FollowSinglePoliticianRepository();
		const promises: Promise<boolean>[] = followees.map((followee) =>
			followSinglePoliticianRepository.followSinglePolitician(userName, followee)
		);
		const results = await Promise.allSettled(promises);
		const rejected = (results.filter((result) => result.status === 'rejected') as PromiseRejectedResult[]).map(
			(result) => result.reason?.context
		);
		return rejected;
	}
}
