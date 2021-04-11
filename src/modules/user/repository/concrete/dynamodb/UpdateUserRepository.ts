import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { DynamoDBInstance } from '../../../../../shared/infra/dynamodb/DynamoDBInstance';
import { UpdateUserDTO } from '../../../entities/DTO';
import { IUpdateUserRepository } from '../../interface/IUpdateUserRepository';

export class UpdateUserRepository implements IUpdateUserRepository {
	async update(data: UpdateUserDTO): Promise<boolean> {
		const UpdateExpression = Object.keys(data)
			.map((key) => `#${key} = :${key}`)
			.join(' , ');
		const ExpressionAttributeNames = Object.keys(data).reduce((acc, key) => ({ ...acc, [`#${key}`]: key }), {});
		const keys = Object.keys(data) as Array<keyof UpdateUserDTO>;
		const ExpressionAttributeValues = keys.reduce((acc, key) => ({ ...acc, [`:${key}`]: data[key] }), {});
		const params: DocumentClient.UpdateItemInput = {
			TableName: process.env.DB_TABLE || '',
			Key: { PK: `USER#${data.name}`, SK: `USER#${data.name}` },
			UpdateExpression: `set ${UpdateExpression}`,
			ExpressionAttributeNames,
			ExpressionAttributeValues,
		};

		await DynamoDBInstance.update(params).promise();
		return true;
	}
}
