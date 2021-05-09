import { APIGatewayProxyHandler } from 'aws-lambda';

import { EntityNotFoundError } from '../../../shared/exceptions/domain/EntityNotFoundError';
import { InternalServerException } from '../../../shared/infra/http/errors/http_server_error';
import { HttpRequestService } from '../../../shared/infra/http/helpers/requestHandler';
import { ListRelevantPoliticiansByThemeRepository } from '../repository/concrete/dynamodb/ListRelevantPoliticiansByThemeRepository';
import { IListRelevantPoliticiansByThemeRepository } from '../repository/concrete/interface/IListRelevantPoliticiansByThemeRepository';
import { ListRelevantPoliticiansByThemeUsecase } from '../usecase/ListRelevantPoliticiansByThemeUsecase';

const listRelevantPoliticiansByThemeRepository: IListRelevantPoliticiansByThemeRepository = new ListRelevantPoliticiansByThemeRepository();
const listRelevantPoliticiansByThemeUsecase = new ListRelevantPoliticiansByThemeUsecase(
	listRelevantPoliticiansByThemeRepository
);

export const listRelevantPoliticiansByTheme: APIGatewayProxyHandler = async (event): Promise<any> => {
	const requestHandler = new HttpRequestService();
	try {
		const themesId = [
			event.queryStringParameters?.first ?? '',
			event.queryStringParameters?.second ?? '',
			event.queryStringParameters?.third ?? '',
		];
		const politicians = await listRelevantPoliticiansByThemeUsecase.listRelevantPoliticiansByTheme(themesId);
		if (politicians) {
			return requestHandler.success(200, politicians);
		}
	} catch (error) {
		if (error instanceof EntityNotFoundError) return requestHandler.customError(404);
		return requestHandler.error(new InternalServerException(error));
	}
};
