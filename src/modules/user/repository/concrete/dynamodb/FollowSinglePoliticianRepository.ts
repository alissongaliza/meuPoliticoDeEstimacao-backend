import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { ConditionError } from '../../../../../shared/exceptions/domain/ConditionError';
import { EntityNotFoundError } from '../../../../../shared/exceptions/domain/EntityNotFoundError';
import { DatabaseError } from '../../../../../shared/exceptions/repository/DatabaseError';
import { DynamoDBInstance } from '../../../../../shared/infra/dynamodb/DynamoDBInstance';
import { Followee } from '../../../entities/DTO';
import { IFollowSinglePoliticianRepository } from '../../interface/IFollowSinglePoliticianRepository';

export class FollowSinglePoliticianRepository implements IFollowSinglePoliticianRepository {
	async followSinglePolitician(userName: string, followee: Followee): Promise<boolean> {
		const updateCount: DocumentClient.Update = {
			TableName: process.env.DB_TABLE || '',
			Key: { PK: `POLITICIAN#${followee.id}`, SK: `POLITICIAN#${followee.id}` },
			UpdateExpression: 'set #count = #count + :incr',
			ExpressionAttributeNames: {
				'#count': 'followersCount',
			},
			ExpressionAttributeValues: {
				':incr': 1,
			},
		};
		const putFollow: DocumentClient.Put = {
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
			ConditionExpression: 'attribute_not_exists(#PK) AND attribute_not_exists(#SK)',
			ExpressionAttributeNames: {
				'#PK': 'PK',
				'#SK': 'SK',
			},
		};
		const params: DocumentClient.TransactWriteItemsInput = {
			TransactItems: [{ Put: putFollow }, { Update: updateCount }],
		};
		try {
			await DynamoDBInstance.transactWrite(params).promise();
			return true;
		} catch (e) {
			if (e.code === 'TransactionCanceledException' && e.message.includes('ConditionalCheckFailed'))
				throw new ConditionError('User already follows this Politician', {
					reason: 'User already follows this Politician',
					userName,
					followee,
				});
			else if (e.code === 'ValidationException')
				throw new EntityNotFoundError('Politician does not exist', {
					reason: 'Politician does not exist',
					userName,
					followee,
				});
			else throw new DatabaseError(e, { reason: userName, followee });
		}
	}
}
