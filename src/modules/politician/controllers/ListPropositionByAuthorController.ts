import { APIGatewayProxyHandler } from 'aws-lambda';

import { EntityNotFoundError } from '../../../shared/exceptions/domain/EntityNotFoundError';
import { InternalServerException } from '../../../shared/infra/http/errors/http_server_error';
import { HttpRequestService } from '../../../shared/infra/http/helpers/requestHandler';
import { ListPropositionByAuthorRepository } from '../repository/concrete/dynamodb/ListPropositionByAuthorRepository';
import { IListPropositionByAuthorRepository } from '../repository/concrete/interface/IListPropositionByAuthorRepository';
import { ListPropositionByAuthorUsecase } from '../usecase/ListPropositionByAuthorUsecase';

const listPropositionByAuthorRepository: IListPropositionByAuthorRepository = new ListPropositionByAuthorRepository();
const listPropositionByAuthorUsecase = new ListPropositionByAuthorUsecase(listPropositionByAuthorRepository);

export const listPropositionByAuthor: APIGatewayProxyHandler = async (event): Promise<any> => {
	const requestHandler = new HttpRequestService();
	try {
		const propositions = await listPropositionByAuthorUsecase.listPropositionByAuthor(event.pathParameters?.id ?? '');
		if (propositions) {
			return requestHandler.success(200, propositions);
		}
	} catch (error) {
		if (error instanceof EntityNotFoundError) return requestHandler.customError(404);
		return requestHandler.error(new InternalServerException(error));
	}
};
