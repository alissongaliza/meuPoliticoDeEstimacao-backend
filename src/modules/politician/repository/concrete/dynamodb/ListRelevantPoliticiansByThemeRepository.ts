import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { EntityNotFoundError } from '../../../../../shared/exceptions/domain/EntityNotFoundError';
import { DynamoDBInstance } from '../../../../../shared/infra/dynamodb/DynamoDBInstance';
import { PoliticiansIdAndTheme } from '../../../entities/DTO';
import { AuthorThemeDynamodb } from '../../../entities/Dynamodb';
import { IListRelevantPoliticiansByThemeRepository } from '../interface/IListRelevantPoliticiansByThemeRepository';

export class ListRelevantPoliticiansByThemeRepository implements IListRelevantPoliticiansByThemeRepository {
	async listRelevantPoliticiansByTheme(id: string): Promise<PoliticiansIdAndTheme> {
		const params: DocumentClient.QueryInput = {
			TableName: process.env.DB_TABLE || '',
			IndexName: 'GSI1',
			KeyConditionExpression: '#theme = :theme AND #sk > :sk',
			ExpressionAttributeNames: {
				'#theme': 'GSI1PK',
				'#sk': 'GSI1SK',
			},
			ExpressionAttributeValues: {
				':theme': `THEME#${id}`,
				':sk': `THEME#${id}`,
			},
			Limit: 25,
			ScanIndexForward: false,
		};
		const { Items } = await DynamoDBInstance.query(params).promise();
		if (Items && Items.length > 0) {
			const politicians = (Items as AuthorThemeDynamodb[]).map((el) => ({
				authorId: el.authorId,
				count: el.count,
				authorName: el.authorName,
			}));
			return { themeId: id, politicians };
		} else throw new EntityNotFoundError(`Theme with id of ${id} does not exist`);
	}
}
