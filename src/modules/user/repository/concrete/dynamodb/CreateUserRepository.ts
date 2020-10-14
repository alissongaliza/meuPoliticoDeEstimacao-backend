import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import * as uuid from 'uuid';

import { DynamoDBInstance } from '../../../../../shared/infra/dynamodb/DynamoDBInstance';
import { DBException } from '../../../../../shared/infra/dynamodb/errors/DBException';
import { CreateUserDTO } from '../../../entities/UserDTO';
import { ICreateUserRepository } from '../../interface/ICreateUserRepository';

export class CreateUserRepository implements ICreateUserRepository {
	async create(data: CreateUserDTO): Promise<string> {
		const id = uuid.v4();
		const formattedUser = {
			entity: `USER#${id}`,
			data: `METADATA#${id}`,
			favoriteThemes: data.favoriteThemes,
		};
		const params: DocumentClient.PutItemInput = {
			TableName: process.env.DB_TABLE || '',
			Item: formattedUser,
		};
		try {
			const added: any = await DynamoDBInstance.put(params).promise();
			// return only the uuid generated part
			return formattedUser.entity.split('#')[1];
		} catch (e) {
			throw new DBException(e.message, e.statusCode);
		}
	}
}
