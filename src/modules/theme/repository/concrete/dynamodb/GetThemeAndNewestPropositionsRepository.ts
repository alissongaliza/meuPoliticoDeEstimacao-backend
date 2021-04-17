import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { EntityNotFound } from '../../../../../shared/exceptions/EntityNotFound';
import { DynamoDBInstance } from '../../../../../shared/infra/dynamodb/DynamoDBInstance';
import { PropositionDynamodb } from '../../../../proposition/entities/Dynamodb';
import { Proposition } from '../../../../proposition/entities/Proposition';
import { ThemeDynamodb } from '../../../entities/Dynamodb';
import { Theme } from '../../../entities/Theme';
import { IGetThemeAndNewestPropositionsRepository } from '../../interface/IGetThemeAndNewestPropositionsRepository';

export class GetThemeAndNewestPropositionsRepository implements IGetThemeAndNewestPropositionsRepository {
	async getThemeAndNewestPropositions(id: string): Promise<Theme> {
		const params: DocumentClient.QueryInput = {
			TableName: process.env.DB_TABLE || '',
			IndexName: 'GSI1',
			KeyConditionExpression: '#theme = :theme AND #sk <= :sk',
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
			const dynamoTheme = <ThemeDynamodb>Items?.[0];
			const dynamoPropositions = Items.length > 1 ? <PropositionDynamodb[]>Items.slice(1) : [];
			const id = dynamoTheme.PK.split('#')?.[1];
			const propositions = dynamoPropositions.map<Proposition>(({ PK }) =>
				Proposition.create(PK.split('#')?.[1], '', '', [], [])
			);
			return Theme.create(id ?? dynamoTheme.PK, dynamoTheme.name, -1, propositions);
		} else throw new EntityNotFound();
	}
}
