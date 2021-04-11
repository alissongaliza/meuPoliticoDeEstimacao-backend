import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { DynamoDBInstance } from '../../../../../shared/infra/dynamodb/DynamoDBInstance';
import { differenceOfSets } from '../../../../../shared/util/util';
import { RankThemesDTO } from '../../../entities/DTO';
import { IRankThemesRepository } from '../../interface/IRankThemesRepository';

export class RankThemesRepository implements IRankThemesRepository {
	async rankThemes(userId: string, themes: RankThemesDTO): Promise<boolean> {
		const userUpdate: DocumentClient.Update = {
			TableName: process.env.DB_TABLE || '',
			Key: { PK: `USER#${userId}`, SK: `USER#${userId}` },
			UpdateExpression: 'set #favoriteThemes = :favoriteThemes',
			ExpressionAttributeNames: {
				'#favoriteThemes': 'favoriteThemes',
			},
			ExpressionAttributeValues: {
				':favoriteThemes': themes.newFavoriteThemes,
			},
		};

		const oldSet = new Set(themes.oldFavoriteThemes);
		const newSet = new Set(themes.newFavoriteThemes);
		const toBeIncreased: string[] = Array.from(differenceOfSets(newSet, oldSet));
		const toBeDecreased: string[] = Array.from(differenceOfSets(oldSet, newSet));
		const idsNames: Record<string, string> = {};
		const increaseUpdateExpression: string[] = [];

		toBeIncreased.forEach((id) => {
			increaseUpdateExpression.push(`#themes.#${id}.#count = #themes.#${id}.#count + :incr`);
			idsNames[`#${id}`] = id;
		});
		const decreaseUpdateExpression: string[] = [];
		toBeDecreased.forEach((id) => {
			decreaseUpdateExpression.push(`#themes.#${id}.#count = #themes.#${id}.#count - :incr`);
			idsNames[`#${id}`] = id;
		});
		const mergedThemeExpression = increaseUpdateExpression.concat(decreaseUpdateExpression).join(' , ');

		const themeUpdate: DocumentClient.Update = {
			TableName: process.env.DB_TABLE || '',
			Key: { PK: 'THEMES', SK: 'THEMES' },
			UpdateExpression: `set ${mergedThemeExpression}`,
			ExpressionAttributeNames: {
				'#themes': 'themes',
				'#count': 'count',
				...idsNames,
			},
			ExpressionAttributeValues: {
				':incr': 1,
			},
		};

		const transaction: DocumentClient.TransactWriteItemsInput = {
			TransactItems: [{ Update: userUpdate }, { Update: themeUpdate }],
		};
		await DynamoDBInstance.transactWrite(transaction).promise();
		return true;
	}
}
