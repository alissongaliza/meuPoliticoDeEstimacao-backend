import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { EntityNotFoundError } from '../../../../../shared/exceptions/domain/EntityNotFoundError';
import { DynamoDBInstance } from '../../../../../shared/infra/dynamodb/DynamoDBInstance';
import { ListThemesByAuthorDTO } from '../../../entities/DTO';
import { AuthorThemeDynamodb } from '../../../entities/Dynamodb';
import { IListThemesByAuthorRepository } from '../interface/IListThemesByAuthorRepository';

export class ListThemesByAuthorRepository implements IListThemesByAuthorRepository {
	async listThemesByAuthor(id: string): Promise<ListThemesByAuthorDTO[]> {
		const params: DocumentClient.QueryInput = {
			TableName: process.env.DB_TABLE || '',
			IndexName: 'GSI2',
			KeyConditionExpression: '#politician = :politician',
			ExpressionAttributeNames: {
				'#politician': 'GSI2PK',
			},
			ExpressionAttributeValues: {
				':politician': `POLITICIAN#${id}`,
			},
			Limit: 25,
			ScanIndexForward: false,
		};
		const { Items } = await DynamoDBInstance.query(params).promise();
		if (Items && Items.length > 0) {
			return (Items as AuthorThemeDynamodb[]).map<ListThemesByAuthorDTO>((el) => ({
				id: el.themeId,
				count: el.count,
			}));
		} else throw new EntityNotFoundError(`Author with id of ${id} does not have any themes`);
	}
}
