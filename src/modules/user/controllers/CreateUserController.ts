import { APIGatewayProxyHandler } from 'aws-lambda';

import { BaseHttpError } from '../../../shared/infra/http/errors/base_http_error';
import { InternalServerException } from '../../../shared/infra/http/errors/http_server_error';
import { HttpRequestService } from '../../../shared/infra/http/helpers/requestHandler';
import { CreateUserDTO } from '../entities/DTO';
import { userSchema } from '../entities/Schema';
import { CreateUserRepository } from '../repository/concrete/dynamodb/CreateUserRepository';
import { ICreateUserRepository } from '../repository/interface/ICreateUserRepository';
import { CreateUserUsecase } from '../usecase/CreateUserUsecase';

const createUserRepository: ICreateUserRepository = new CreateUserRepository();
const createUserUsecase = new CreateUserUsecase(createUserRepository);

export const addUser: APIGatewayProxyHandler = async (event): Promise<any> => {
	const requestHandler = new HttpRequestService();
	try {
		const body: CreateUserDTO = await requestHandler.validateBody(event.body, userSchema);
		const created = await createUserUsecase.create(body);
		if (created) {
			return requestHandler.created();
		}
	} catch (error) {
		if (error instanceof BaseHttpError) return requestHandler.error(error);
		return requestHandler.error(new InternalServerException(error));
	}
};
