import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { EntityNotFoundError } from '../../../../../shared/exceptions/domain/EntityNotFoundError';
import { DynamoDBInstance } from '../../../../../shared/infra/dynamodb/DynamoDBInstance';
import { PoliticianIdAndTheme } from '../../../entities/DTO';
import { IListRelevantPoliticiansByThemeRepository } from '../interface/IListRelevantPoliticiansByThemeRepository';

export class ListRelevantPoliticiansByThemeRepository implements IListRelevantPoliticiansByThemeRepository {
	async listRelevantPoliticiansByTheme(id: string): Promise<PoliticianIdAndTheme> {
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
				':sk': '#PROPOSITION#',
			},
			Limit: 25,
			ScanIndexForward: false,
		};
		const { Items } = await DynamoDBInstance.query(params).promise();
		console.info({ Items });
		if (Items && Items.length > 0) {
			const orderedPoliticians = Items.map((el: any) => el.authorId);
			return { themeId: id, politiciansIds: orderedPoliticians };
		} else throw new EntityNotFoundError(`Theme with id of ${id} does not exist`);
	}
}
