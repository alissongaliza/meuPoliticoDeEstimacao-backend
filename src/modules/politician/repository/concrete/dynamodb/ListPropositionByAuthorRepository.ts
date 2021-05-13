import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { EntityNotFoundError } from '../../../../../shared/exceptions/domain/EntityNotFoundError';
import { DynamoDBInstance } from '../../../../../shared/infra/dynamodb/DynamoDBInstance';
import { ListPropositionsByAuthorDTO } from '../../../entities/DTO';
import { AuthorPropositionDynamodb } from '../../../entities/Dynamodb';
import { IListPropositionByAuthorRepository } from '../interface/IListPropositionByAuthorRepository';

export class ListPropositionByAuthorRepository implements IListPropositionByAuthorRepository {
	async listPropositionByAuthor(id: string): Promise<ListPropositionsByAuthorDTO[]> {
		const params: DocumentClient.QueryInput = {
			TableName: process.env.DB_TABLE || '',
			IndexName: 'GSI1',
			KeyConditionExpression: '#author = :author',
			ExpressionAttributeNames: {
				'#author': 'GSI1PK',
			},
			ExpressionAttributeValues: {
				':author': `AUTHOR#${id}`,
			},
			Limit: 25,
		};
		const { Items } = await DynamoDBInstance.query(params).promise();
		console.info({ Items, id });
		if (Items && Items.length > 0) {
			return (Items as AuthorPropositionDynamodb[]).map<ListPropositionsByAuthorDTO>((el) => ({
				id: el.propositionId,
				title: el.title,
			}));
		} else throw new EntityNotFoundError(`Author with id of ${id} does not have any propositions`);
	}
}
