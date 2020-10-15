import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { DynamoDBInstance } from '../../../../../shared/infra/dynamodb/DynamoDBInstance';
import { DBException } from '../../../../../shared/infra/dynamodb/errors/DBException';
import { UpdateUserDTO } from '../../../entities/UserDTO';
import { IUpdateUserRepository } from '../../interface/IUpdateUserRepository';

export class UpdateUserRepository implements IUpdateUserRepository {
	async update(data: UpdateUserDTO): Promise<boolean> {
		const { id, ...user } = data;
		const updatedItem = {
			entity: `USER#${id}`,
			data: `METADATA#${id}`,
			...user,
		};
		const params: DocumentClient.PutItemInput = {
			TableName: process.env.DB_TABLE || '',
			Item: updatedItem,
		};
		try {
			await DynamoDBInstance.put(params).promise();
			return true;
		} catch (e) {
			throw new DBException(e.message, e.statusCode);
		}
	}
}
