import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { EntityNotFound } from '../../../../../shared/exceptions/EntityNotFound';
import { DynamoDBInstance } from '../../../../../shared/infra/dynamodb/DynamoDBInstance';
import { UserDynamodb } from '../../../entities/Dynamodb';
import { User } from '../../../entities/User';
import { IGetUserRepository } from '../../interface/IGetUserRepository';

export class GetUserRepository implements IGetUserRepository {
	async get(name: string): Promise<User> {
		const params: DocumentClient.GetItemInput = {
			TableName: process.env.DB_TABLE || '',
			Key: {
				PK: `USER#${name}`,
				SK: `USER#${name}`,
			},
		};
		const { Item } = await DynamoDBInstance.get(params).promise();
		if (Item) {
			const foundUser = <UserDynamodb>Item;
			return User.create(foundUser.PK, foundUser.email, foundUser.favoriteThemes, []);
		}
		throw new EntityNotFound();
	}
}
