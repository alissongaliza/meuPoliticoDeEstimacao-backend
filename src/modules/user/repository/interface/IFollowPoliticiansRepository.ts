import { Followee } from '../../entities/DTO';

export interface IFollowPoliticiansRepository {
	followPoliticians(userName: string, followees: Followee[]): Promise<boolean>;
}
