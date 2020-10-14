import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { DynamoDBInstance } from '../../../../../shared/infra/dynamodb/DynamoDBInstance';
import { DBException } from '../../../../../shared/infra/dynamodb/errors/DBException';
import { User } from '../../../entities/User';
import { userDynamodbToUser } from '../../../entities/UserDTO';
import { IGetByIdUserRepository } from '../../interface/IGetByIdUserRepository';

export class GetByIdUserRepository implements IGetByIdUserRepository {
	async getById(id: string): Promise<User> {
		const keys = {
			entity: `USER#${id}`,
			data: `METADATA#${id}`,
		};
		const params: DocumentClient.GetItemInput = {
			TableName: process.env.DB_TABLE || '',
			Key: keys,
		};
		try {
			const { Item: user }: any = await DynamoDBInstance.get(params).promise();
			return userDynamodbToUser(user);
		} catch (e) {
			throw new DBException(e.message, e.statusCode);
		}
	}
}
