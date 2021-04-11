import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { DynamoDBInstance } from '../../../../../shared/infra/dynamodb/DynamoDBInstance';
import { CreateUserDTO } from '../../../entities/DTO';
import { UserDynamodb } from '../../../entities/UserDynamodb';
import { ICreateUserRepository } from '../../interface/ICreateUserRepository';

export class CreateUserRepository implements ICreateUserRepository {
	async create(data: CreateUserDTO): Promise<boolean> {
		const userDynamo: UserDynamodb = {
			PK: `USER#${data.name}`,
			SK: `USER#${data.name}`,
			email: data.email,
			favoriteThemes: data.favoriteThemes,
		};
		const params: DocumentClient.PutItemInput = {
			TableName: process.env.DB_TABLE || '',
			Item: userDynamo,
		};
		await DynamoDBInstance.put(params).promise();
		return true;
	}
}
