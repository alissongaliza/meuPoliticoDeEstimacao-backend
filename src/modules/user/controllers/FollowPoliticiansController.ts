import { APIGatewayProxyHandler } from 'aws-lambda';

import { BaseHttpError } from '../../../shared/infra/http/errors/base_http_error';
import { InternalServerException } from '../../../shared/infra/http/errors/http_server_error';
import { HttpRequestService } from '../../../shared/infra/http/helpers/requestHandler';
import { FollowPoliticiansDTO } from '../entities/DTO';
import { followPoliticiansSchema } from '../entities/Schema';
import { FollowManyPoliticiansRepository } from '../repository/concrete/dynamodb/FollowManyPoliticiansRepository';
import { FollowSinglePoliticianRepository } from '../repository/concrete/dynamodb/FollowSinglePoliticianRepository';
import { IFollowManyPoliticiansRepository } from '../repository/interface/IFollowManyPoliticiansRepository';
import { IFollowSinglePoliticianRepository } from '../repository/interface/IFollowSinglePoliticianRepository';
import { FollowPoliticiansUsecase } from '../usecase/FollowPoliticiansUsecase';

const followManyPoliticiansRepository: IFollowManyPoliticiansRepository = new FollowManyPoliticiansRepository();
const followSinglePoliticianRepository: IFollowSinglePoliticianRepository = new FollowSinglePoliticianRepository();
const followPoliticiansUsecase = new FollowPoliticiansUsecase(
	followManyPoliticiansRepository,
	followSinglePoliticianRepository
);

export const followPoliticians: APIGatewayProxyHandler = async (event): Promise<any> => {
	const requestHandler = new HttpRequestService();
	try {
		const body: FollowPoliticiansDTO = await requestHandler.validateBody(event.body, followPoliticiansSchema);
		const followed = await followPoliticiansUsecase.followPoliticians(event.pathParameters?.id || '', body.followees);
		if (followed) {
			return requestHandler.success(204);
		}
	} catch (error) {
		if (error instanceof BaseHttpError) return requestHandler.error(error);
		return requestHandler.error(new InternalServerException(error));
	}
};
