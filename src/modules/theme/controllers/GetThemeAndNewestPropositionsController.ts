import { APIGatewayProxyHandler } from 'aws-lambda';

import { EntityNotFoundError } from '../../../shared/exceptions/domain/EntityNotFoundError';
import { InternalServerException } from '../../../shared/infra/http/errors/http_server_error';
import { HttpRequestService } from '../../../shared/infra/http/helpers/requestHandler';
import { GetThemeAndNewestPropositionsRepository } from '../repository/concrete/dynamodb/GetThemeAndNewestPropositionsRepository';
import { IGetThemeAndNewestPropositionsRepository } from '../repository/interface/IGetThemeAndNewestPropositionsRepository';
import { GetThemeAndNewestPropositionsUsecase } from '../usecase/GetThemeAndNewestPropositionsUsecase';

const getThemeAndNewestPropositionsRepository: IGetThemeAndNewestPropositionsRepository = new GetThemeAndNewestPropositionsRepository();
const getThemeAndNewestPropositionsUsecase = new GetThemeAndNewestPropositionsUsecase(
	getThemeAndNewestPropositionsRepository
);

export const getThemeAndNewestPropositions: APIGatewayProxyHandler = async (event): Promise<any> => {
	const requestHandler = new HttpRequestService();
	try {
		if (!event.pathParameters?.id) requestHandler.customError(404, 'Wrong id');
		const theme = await getThemeAndNewestPropositionsUsecase.getThemeAndNewestPropositions(
			event.pathParameters?.id ?? ''
		);
		// console.info(theme);
		if (theme) {
			return requestHandler.success(200, theme);
		}
	} catch (error) {
		if (error instanceof EntityNotFoundError) return requestHandler.customError(404);
		return requestHandler.error(new InternalServerException(error));
	}
};
