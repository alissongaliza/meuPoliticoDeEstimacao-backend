import { APIGatewayProxyHandler } from 'aws-lambda';

import { EntityNotFoundError } from '../../../shared/exceptions/domain/EntityNotFoundError';
import { InternalServerException } from '../../../shared/infra/http/errors/http_server_error';
import { HttpRequestService } from '../../../shared/infra/http/helpers/requestHandler';
import { ListThemesByAuthorRepository } from '../repository/concrete/dynamodb/ListThemesByAuthorRepository';
import { IListThemesByAuthorRepository } from '../repository/concrete/interface/IListThemesByAuthorRepository';
import { ListThemesByAuthorUsecase } from '../usecase/ListThemesByAuthorUsecase';

const listThemesByAuthorRepository: IListThemesByAuthorRepository = new ListThemesByAuthorRepository();
const listThemesByAuthorUsecase = new ListThemesByAuthorUsecase(listThemesByAuthorRepository);

export const listThemesByAuthor: APIGatewayProxyHandler = async (event): Promise<any> => {
	const requestHandler = new HttpRequestService();
	try {
		const themes = await listThemesByAuthorUsecase.listThemesByAuthor(event.pathParameters?.id ?? '');
		if (themes) {
			return requestHandler.success(200, themes);
		}
	} catch (error) {
		if (error instanceof EntityNotFoundError) return requestHandler.customError(404);
		return requestHandler.error(new InternalServerException(error));
	}
};
