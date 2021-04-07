import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { DynamoDBInstance } from '../../../../../shared/infra/dynamodb/DynamoDBInstance';
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
		const added: any = await DynamoDBInstance.get(params).promise();
		console.log({ added });
		return added;
	}
}
