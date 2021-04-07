import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { DynamoDBInstance } from '../../../../../shared/infra/dynamodb/DynamoDBInstance';
import { User } from '../../../entities/User';
import { CreateUserDTO } from '../../../entities/UserDTO';
import { ICreateUserRepository } from '../../interface/ICreateUserRepository';

export class CreateUserRepository implements ICreateUserRepository {
	async create(data: CreateUserDTO): Promise<User> {
		const formattedUser = {
			PK: `USER#${data.name}`,
			SK: `USER#${data.name}`,
			favoriteThemes: data.favoriteThemes,
		};
		const params: DocumentClient.PutItemInput = {
			TableName: process.env.DB_TABLE || '',
			Item: formattedUser,
		};
		const added: any = await DynamoDBInstance.put(params).promise();
		console.log({ added });
		return added;
	}
}
