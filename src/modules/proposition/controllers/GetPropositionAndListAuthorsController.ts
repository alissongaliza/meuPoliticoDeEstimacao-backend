import { APIGatewayProxyHandler } from 'aws-lambda';

import { EntityNotFoundError } from '../../../shared/exceptions/domain/EntityNotFoundError';
import { InternalServerException } from '../../../shared/infra/http/errors/http_server_error';
import { HttpRequestService } from '../../../shared/infra/http/helpers/requestHandler';
import { GetPropositionAndListAuthorsRepository } from '../repository/concrete/dynamodb/GetPropositionAndListAuthorsRepository';
import { IGetPropositionAndListAuthorsRepository } from '../repository/interface/IGetPropositionAndListAuthorsRepository';
import { GetPropositionAndListAuthorsUsecase } from '../usecase/GetPropositionAndListAuthors';

const getPropositionAndListAuthorsRepository: IGetPropositionAndListAuthorsRepository = new GetPropositionAndListAuthorsRepository();
const getPropositionAndListAuthorsUsecase = new GetPropositionAndListAuthorsUsecase(
	getPropositionAndListAuthorsRepository
);

export const getPropositionAndListAuthors: APIGatewayProxyHandler = async (event): Promise<any> => {
	const requestHandler = new HttpRequestService();
	try {
		if (!event.pathParameters?.id) requestHandler.customError(404, 'Wrong id');
		const proposition = await getPropositionAndListAuthorsUsecase.getPropositionAndListAuthors(
			event.pathParameters?.id ?? ''
		);
		if (proposition) {
			return requestHandler.success(200, proposition);
		}
	} catch (error) {
		if (error instanceof EntityNotFoundError) return requestHandler.customError(404);
		return requestHandler.error(new InternalServerException(error));
	}
};
