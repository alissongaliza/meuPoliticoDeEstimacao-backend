import { APIGatewayProxyHandler } from 'aws-lambda';

import { EntityNotFound } from '../../../shared/exceptions/EntityNotFound';
import { InternalServerException } from '../../../shared/infra/http/errors/http_server_error';
import { HttpRequestService } from '../../../shared/infra/http/helpers/requestHandler';
import { ListThemesRepository } from '../repository/concrete/dynamodb/ListThemesRepository';
import { IListThemesRepository } from '../repository/interface/IListThemesRepository';
import { ListThemesUsecase } from '../usecase/concrete/ListThemesUsecase';

const listThemesRepository: IListThemesRepository = new ListThemesRepository();
const listThemesUsecase = new ListThemesUsecase(listThemesRepository);

export const listThemes: APIGatewayProxyHandler = async (event): Promise<any> => {
	const requestHandler = new HttpRequestService();
	try {
		const themes = await listThemesUsecase.listThemes();
		if (themes) {
			return requestHandler.success(200, themes);
		}
	} catch (error) {
		if (error instanceof EntityNotFound) return requestHandler.customError(404);
		return requestHandler.error(new InternalServerException(error));
	}
};
