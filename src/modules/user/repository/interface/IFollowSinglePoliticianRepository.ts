import { Followee } from '../../entities/DTO';

export interface IFollowSinglePoliticianRepository {
	followSinglePolitician(userName: string, followee: Followee): Promise<boolean>;
}
