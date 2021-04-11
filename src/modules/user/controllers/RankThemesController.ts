import { APIGatewayProxyHandler } from 'aws-lambda';

import { BaseHttpError } from '../../../shared/infra/http/errors/base_http_error';
import { InternalServerException } from '../../../shared/infra/http/errors/http_server_error';
import { HttpRequestService } from '../../../shared/infra/http/helpers/requestHandler';
import { RankThemesDTO } from '../entities/DTO';
import { rankThemesSchema } from '../entities/Schema';
import { RankThemesRepository } from '../repository/concrete/dynamodb/RankThemesRepository';
import { IRankThemesRepository } from '../repository/interface/IRankThemesRepository';
import { RankThemesUsecase } from '../usecase/RankThemesUsecase';

const rankThemesRepository: IRankThemesRepository = new RankThemesRepository();
const rankThemesUsecase = new RankThemesUsecase(rankThemesRepository);

export const rankThemes: APIGatewayProxyHandler = async (event): Promise<any> => {
	const requestHandler = new HttpRequestService();
	try {
		const body: RankThemesDTO = await requestHandler.validateBody(event.body, rankThemesSchema);
		const userId = event.pathParameters?.id;
		if (!userId) {
			return requestHandler.customError(404);
		}
		const updated = await rankThemesUsecase.rankThemes(userId, body);
		if (updated) {
			return requestHandler.success(204);
		}
	} catch (error) {
		if (error instanceof BaseHttpError) return requestHandler.error(error);
		return requestHandler.error(new InternalServerException(error));
	}
};
