import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { DynamoDBInstance } from '../../../../../shared/infra/dynamodb/DynamoDBInstance';
import { Followee } from '../../../entities/DTO';
import { IFollowManyPoliticiansRepository } from '../../interface/IFollowManyPoliticiansRepository';

export class FollowManyPoliticiansRepository implements IFollowManyPoliticiansRepository {
	async followManyPoliticians(userName: string, followees: Followee[]): Promise<boolean> {
		const newFollowees = followees.map<DocumentClient.WriteRequest>(({ id, name, partyCode, photoUrl }) => {
			return {
				PutRequest: {
					Item: {
						PK: `USER#${userName}`,
						SK: `POLITICIAN#${id}`,
						userId: userName,
						politicianId: id,
						politicianName: name,
						politicianPhotoUrl: photoUrl,
						politicianPartyCode: partyCode,
					},
				},
			};
		});
		const params: DocumentClient.BatchWriteItemInput = {
			RequestItems: {
				[process.env.DB_TABLE || '']: newFollowees,
			},
		};

		await DynamoDBInstance.batchWrite(params).promise();
		return true;
	}
}
