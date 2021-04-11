import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { EntityNotFound } from '../../../../../shared/exceptions/EntityNotFound';
import { DynamoDBInstance } from '../../../../../shared/infra/dynamodb/DynamoDBInstance';
import { ThemesDynamodb } from '../../../entities/Dynamodb';
import { Theme } from '../../../entities/Theme';
import { IListThemesRepository } from '../../interface/IListThemesRepository';

export class ListThemesRepository implements IListThemesRepository {
	async listThemes(): Promise<Theme[]> {
		const params: DocumentClient.GetItemInput = {
			TableName: process.env.DB_TABLE || '',
			Key: {
				PK: 'THEMES',
				SK: 'THEMES',
			},
		};
		const { Item } = await DynamoDBInstance.get(params).promise();
		if (Item) {
			const dynamoThemes = <ThemesDynamodb>Item;
			const themes = Object.values(dynamoThemes.themes).map(({ id, name, count }) => Theme.create(id, name, count));
			return themes;
		}
		throw new EntityNotFound();
	}
}
