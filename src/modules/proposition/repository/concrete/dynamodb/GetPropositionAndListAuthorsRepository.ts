import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { EntityNotFound } from '../../../../../shared/exceptions/EntityNotFound';
import { DynamoDBInstance } from '../../../../../shared/infra/dynamodb/DynamoDBInstance';
import { AuthorDynamodb } from '../../../../politician/entities/Dynamodb';
import { Politician } from '../../../../politician/entities/Politician';
import { PropositionDynamodb } from '../../../entities/Dynamodb';
import { Proposition } from '../../../entities/Proposition';
import { IGetPropositionAndListAuthorsRepository } from '../../interface/IGetPropositionAndListAuthorsRepository';

export class GetPropositionAndListAuthorsRepository implements IGetPropositionAndListAuthorsRepository {
	async getPropositionAndListAuthors(id: string): Promise<Proposition> {
		let ExclusiveStartKey;
		const items: (PropositionDynamodb | AuthorDynamodb)[] = [];
		do {
			const params: DocumentClient.QueryInput = {
				TableName: process.env.DB_TABLE || '',
				KeyConditionExpression: '#proposition = :proposition AND begins_with(#sk,:substring)',
				ExpressionAttributeNames: {
					'#proposition': 'PK',
					'#sk': 'SK',
				},
				ExpressionAttributeValues: {
					':proposition': `PROPOSITION#${id}`,
					':substring': 'AUTHOR#',
				},
				ScanIndexForward: false,
				ExclusiveStartKey,
			};
			const { Items, LastEvaluatedKey } = await DynamoDBInstance.query(params).promise();
			ExclusiveStartKey = LastEvaluatedKey;
			if (Items && Items?.length > 0) items.push(<any>Items);
		} while (ExclusiveStartKey !== undefined);

		if (items && items.length > 1) {
			const dynamoProposition = <PropositionDynamodb>items?.[0];
			const dynamoAuthors = <AuthorDynamodb[]>items.slice(1);
			const id = dynamoProposition?.id;
			const authors = dynamoAuthors.map<Politician>(({ politicianId }) =>
				Politician.create(politicianId, '', '', '', '', '', '', '', [])
			);
			return Proposition.create(
				id ?? dynamoProposition.PK,
				dynamoProposition.uri ?? '',
				dynamoProposition.ementa ?? '',
				authors,
				[]
			);
		}
		throw new EntityNotFound();
	}
}
