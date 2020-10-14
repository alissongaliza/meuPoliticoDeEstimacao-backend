import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import * as uuid from 'uuid';

import { DynamoDBInstance } from '../../../../../shared/infra/dynamodb/DynamoDBInstance';
import { User } from '../../../entities/User';
import { CreateUserDTO } from '../../../entities/UserDTO';
import { ICreateUserRepository } from '../../interface/ICreateUserRepository';

export class CreateUserRepository implements ICreateUserRepository {
	async create(data: CreateUserDTO): Promise<User> {
		const formattedUser = {
			entity: `USER#${uuid.v4()}`,
			data: `METADATA#${data.name}`,
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