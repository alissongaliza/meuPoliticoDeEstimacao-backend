import { APIGatewayProxyHandler } from 'aws-lambda';

import { BaseHttpError } from '../../../shared/infra/http/errors/base_http_error';
import { InternalServerException } from '../../../shared/infra/http/errors/http_server_error';
import { HttpRequestService } from '../../../shared/infra/http/helpers/requestHandler';
import { FollowManyPoliticianDTO } from '../entities/DTO';
import { followManyPoliticianSchema } from '../entities/Schema';
import { FollowManyPoliticianRepository } from '../repository/concrete/dynamodb/FollowManyPoliticianRepository';
import { IFollowManyPoliticianRepository } from '../repository/interface/IFollowManyPoliticianRepository';
import { FollowManyPoliticianUsecase } from '../usecase/followManyPoliticianUsecase';

const followManyPoliticianRepository: IFollowManyPoliticianRepository = new FollowManyPoliticianRepository();
const followManyPoliticianUsecase = new FollowManyPoliticianUsecase(followManyPoliticianRepository);

export const followManyPolitician: APIGatewayProxyHandler = async (event): Promise<any> => {
	const requestHandler = new HttpRequestService();
	try {
		const body: FollowManyPoliticianDTO = await requestHandler.validateBody(event.body, followManyPoliticianSchema);
		const followed = await followManyPoliticianUsecase.followManyPolitician(
			event.pathParameters?.id || '',
			body.followees
		);
		if (followed) {
			return requestHandler.success(204);
		}
	} catch (error) {
		if (error instanceof BaseHttpError) return requestHandler.error(error);
		return requestHandler.error(new InternalServerException(error));
	}
};
