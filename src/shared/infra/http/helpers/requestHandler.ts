import Joi from 'joi';

import { BaseHttpError } from '../errors/base_http_error';
import { InvalidJsonException, InvalidParamsException, NullBodyException } from '../errors/http_client_error';

const headers = { 'Access-Control-Allow-Origin': '*' };

/**
 * Implementation of the request service for HTTP protocol.
 */
export class HttpRequestService {
	validateBody(body: any, validator: Joi.ObjectSchema<any>): Promise<any> {
		return new Promise((resolve) => {
			if (body === null) {
				throw new NullBodyException();
			}
			try {
				body = JSON.parse(body);
			} catch {
				throw new InvalidJsonException(body);
			}
			const validationResult = validator.validate(body);
			if (validationResult.error) throw new InvalidParamsException(validationResult.error);

			resolve(body);
		});
	}

	success(httpStatus = 200, body: unknown = ''): Promise<any> {
		return Promise.resolve({
			statusCode: httpStatus,
			headers: headers,
			body: JSON.stringify(body),
		});
	}

	created(): Promise<any> {
		return Promise.resolve({
			statusCode: 201,
			headers: headers,
			body: null,
		});
	}

	error(error: BaseHttpError): Promise<any> {
		return Promise.resolve({
			headers: headers,
			statusCode: error.httpStatus,
			body: JSON.stringify({
				message: error.message,
				errorCode: error.errorCode,
				data: error.data,
			}),
		});
	}

	customError(statusCode: number, message = '', body = {}): Promise<any> {
		return Promise.resolve({
			headers: headers,
			statusCode,
			body: JSON.stringify({ message, data: body }),
		});
	}

	successPaginate(
		body: any = {},
		total: number,
		lastIndex: string,
		httpStatus = 200,
		message = 'HTTP_SUCCESS_DEFAULT'
	): Promise<any> {
		return Promise.resolve({
			statusCode: httpStatus,
			headers: headers,
			body: JSON.stringify({
				message: message,
				total: total,
				lastEvaluatedIndex: lastIndex,
				data: body,
			}),
		});
	}
}
