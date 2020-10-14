import { APIGatewayProxyHandler } from 'aws-lambda';

import { BaseHttpError } from '../../../shared/infra/http/errors/base_http_error';
import { InternalServerException } from '../../../shared/infra/http/errors/http_server_error';
import { HttpRequestService } from '../../../shared/infra/http/helpers/requestHandler';
import { CreateUserDTO } from '../entities/UserDTO';
import { userSchema } from '../entities/UserSchema';
import { CreateUserRepository } from '../repository/concrete/dynamodb/CreateUserRepository';
import { GetByIdUserRepository } from '../repository/concrete/dynamodb/GetByIdUserRepository';
import { CreateUserUsecase } from '../usecase/concrete/CreateUserUsecase';

const createUserRepository = new CreateUserRepository();
const getByIdUserRepository = new GetByIdUserRepository();
const createUserUsecase = new CreateUserUsecase(createUserRepository, getByIdUserRepository);

export const addUser: APIGatewayProxyHandler = async (event): Promise<any> => {
	const requestHandler = new HttpRequestService();
	try {
		const body: CreateUserDTO = await requestHandler.validateBody(event.body, userSchema);
		const created = await createUserUsecase.create(body);
		if (created) {
			requestHandler.success({}, 201);
		}
	} catch (error) {
		if (error instanceof BaseHttpError) return requestHandler.error(error);
		return requestHandler.error(new InternalServerException(error));
	}
};
