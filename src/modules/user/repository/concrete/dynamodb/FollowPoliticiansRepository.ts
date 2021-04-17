import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { DynamoDBInstance } from '../../../../../shared/infra/dynamodb/DynamoDBInstance';
import { Followee } from '../../../entities/DTO';
import { IFollowPoliticiansRepository } from '../../interface/IFollowPoliticiansRepository';

export class FollowPoliticiansRepository implements IFollowPoliticiansRepository {
	async followPoliticians(userName: string, followees: Followee[]): Promise<boolean> {
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
