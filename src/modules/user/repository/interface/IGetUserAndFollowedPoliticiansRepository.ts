import { User } from '../../entities/User';

export interface IGetUserAndFollowedPoliticiansRepository {
	getUserAndFollowedPoliticians(userId: string): Promise<User>;
}
