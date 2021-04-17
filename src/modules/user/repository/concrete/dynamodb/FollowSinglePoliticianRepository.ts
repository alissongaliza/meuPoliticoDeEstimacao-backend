import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { DynamoDBInstance } from '../../../../../shared/infra/dynamodb/DynamoDBInstance';
import { Followee } from '../../../entities/DTO';
import { IFollowSinglePoliticianRepository } from '../../interface/IFollowSinglePoliticianRepository';

export class FollowSinglePoliticianRepository implements IFollowSinglePoliticianRepository {
	async followSinglePolitician(userName: string, followee: Followee): Promise<boolean> {
		const params: DocumentClient.PutItemInput = {
			TableName: process.env.DB_TABLE || '',
			Item: {
				PK: `USER#${userName}`,
				SK: `POLITICIAN#${followee.id}`,
				userId: userName,
				politicianId: followee.id,
				politicianName: followee.name,
				politicianPhotoUrl: followee.photoUrl,
				politicianPartyCode: followee.partyCode,
			},
		};

		await DynamoDBInstance.put(params).promise();
		return true;
	}
}
