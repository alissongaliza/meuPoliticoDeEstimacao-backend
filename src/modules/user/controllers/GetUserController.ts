import { APIGatewayProxyHandler } from 'aws-lambda';

import { EntityNotFound } from '../../../shared/exceptions/EntityNotFound';
import { InternalServerException } from '../../../shared/infra/http/errors/http_server_error';
import { HttpRequestService } from '../../../shared/infra/http/helpers/requestHandler';
import { GetUserRepository } from '../repository/concrete/dynamodb/GetUserRepository';
import { GetUserUsecase } from '../usecase/concrete/GetUserUsecase';

const getUserRepository = new GetUserRepository();
const getUserUsecase = new GetUserUsecase(getUserRepository);

export const getUser: APIGatewayProxyHandler = async (event): Promise<any> => {
	const requestHandler = new HttpRequestService();
	try {
		console.info(event);
		const user = await getUserUsecase.get(event.pathParameters?.name ?? '');
		if (user) {
			return requestHandler.success(user, 200);
		}
	} catch (error) {
		if (error instanceof EntityNotFound) return requestHandler.customError(404);
		return requestHandler.error(new InternalServerException(error));
	}
};
