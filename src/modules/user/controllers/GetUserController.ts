import { APIGatewayProxyHandler } from 'aws-lambda';

import { EntityNotFoundError } from '../../../shared/exceptions/domain/EntityNotFoundError';
import { InternalServerException } from '../../../shared/infra/http/errors/http_server_error';
import { HttpRequestService } from '../../../shared/infra/http/helpers/requestHandler';
import { GetUserRepository } from '../repository/concrete/dynamodb/GetUserRepository';
import { IGetUserRepository } from '../repository/interface/IGetUserRepository';
import { GetUserUsecase } from '../usecase/GetUserUsecase';

const getUserRepository: IGetUserRepository = new GetUserRepository();
const getUserUsecase = new GetUserUsecase(getUserRepository);

export const getUser: APIGatewayProxyHandler = async (event): Promise<any> => {
	const requestHandler = new HttpRequestService();
	try {
		const user = await getUserUsecase.get(event.pathParameters?.name ?? '');
		if (user) {
			return requestHandler.success(200, user);
		}
	} catch (error) {
		if (error instanceof EntityNotFoundError) return requestHandler.customError(404);
		return requestHandler.error(new InternalServerException(error));
	}
};
