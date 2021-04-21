import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { EntityNotFoundError } from '../../../../../shared/exceptions/domain/EntityNotFoundError';
import { DynamoDBInstance } from '../../../../../shared/infra/dynamodb/DynamoDBInstance';
import { Politician } from '../../../../politician/entities/Politician';
import { FolloweeDynamodb, UserDynamodb } from '../../../entities/Dynamodb';
import { User } from '../../../entities/User';
import { IGetUserAndFollowedPoliticiansRepository } from '../../interface/IGetUserAndFollowedPoliticiansRepository';

export class GetUserAndFollowedPoliticiansRepository implements IGetUserAndFollowedPoliticiansRepository {
	async getUserAndFollowedPoliticians(userId: string): Promise<User> {
		let ExclusiveStartKey;
		let items: (UserDynamodb | FolloweeDynamodb)[] = [];
		do {
			const params: DocumentClient.QueryInput = {
				TableName: process.env.DB_TABLE || '',
				KeyConditionExpression: '#user = :user AND #sk <= :sk',
				ExpressionAttributeNames: {
					'#user': 'PK',
					'#sk': 'SK',
				},
				ExpressionAttributeValues: {
					':user': `USER#${userId}`,
					':sk': `USER#${userId}`,
				},
				Limit: 25,
				ScanIndexForward: false,
			};
			const { Items, LastEvaluatedKey } = await DynamoDBInstance.query(params).promise();
			ExclusiveStartKey = LastEvaluatedKey;
			if (Items && Items?.length > 0) items = [...items, ...(<any>Items)];
		} while (ExclusiveStartKey !== undefined);
		if (items && items.length > 0) {
			const dynamoUser = <UserDynamodb>items?.[0];
			const dynamoPoliticians = items.length > 1 ? <FolloweeDynamodb[]>items.slice(1) : [];
			const politicians = dynamoPoliticians.map<Politician>(
				({ politicianId, politicianName, politicianPhotoUrl, politicianPartyCode }) =>
					Politician.create(politicianId, politicianName, '', '', politicianPhotoUrl, '', politicianPartyCode, '', [])
			);
			return User.create(dynamoUser.name, dynamoUser.email, [], politicians);
		} else throw new EntityNotFoundError(`User with id of ${userId} does not exist`);
	}
}
