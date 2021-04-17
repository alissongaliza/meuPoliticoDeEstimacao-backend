import { Followee } from '../../entities/DTO';

export interface IFollowManyPoliticianRepository {
	followManyPolitician(userName: string, followees: Followee[]): Promise<boolean>;
}
