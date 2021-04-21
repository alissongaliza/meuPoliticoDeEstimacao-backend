import { APIGatewayProxyHandler } from 'aws-lambda';

import { EntityNotFoundError } from '../../../shared/exceptions/domain/EntityNotFoundError';
import { InternalServerException } from '../../../shared/infra/http/errors/http_server_error';
import { HttpRequestService } from '../../../shared/infra/http/helpers/requestHandler';
import { GetUserAndFollowedPoliticiansRepository } from '../repository/concrete/dynamodb/GetUserAndFollowedPoliticiansRepository';
import { IGetUserAndFollowedPoliticiansRepository } from '../repository/interface/IGetUserAndFollowedPoliticiansRepository';
import { GetUserAndFollowedPoliticiansUsecase } from '../usecase/GetUserAndFollowedPoliticiansUsecase';

const getUserAndFollowedPoliticiansRepository: IGetUserAndFollowedPoliticiansRepository = new GetUserAndFollowedPoliticiansRepository();
const getUserAndFollowedPoliticiansUsecase = new GetUserAndFollowedPoliticiansUsecase(
	getUserAndFollowedPoliticiansRepository
);

export const getUserAndFollowedPoliticians: APIGatewayProxyHandler = async (event): Promise<any> => {
	const requestHandler = new HttpRequestService();
	try {
		const user = await getUserAndFollowedPoliticiansUsecase.get(event.pathParameters?.id ?? '');
		if (user) {
			return requestHandler.success(200, user);
		}
	} catch (error) {
		if (error instanceof EntityNotFoundError) return requestHandler.customError(404);
		return requestHandler.error(new InternalServerException(error));
	}
};
