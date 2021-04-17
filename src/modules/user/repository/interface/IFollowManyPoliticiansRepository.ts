import { Followee } from '../../entities/DTO';

export interface IFollowManyPoliticiansRepository {
	followManyPoliticians(userName: string, followees: Followee[]): Promise<boolean>;
}
