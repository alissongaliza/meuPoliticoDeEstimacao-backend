import { BaseHttpError } from './base_http_error';

/**
 * Exception for internal server errors.
 */
export class InternalServerException extends BaseHttpError {
	constructor(data: any) {
		super('HTTP_ERROR_DEFAULT', 500, 1, data);
	}
}

/**
 * Exception for contract methods that were not implemented.
 */
export class NotImplementedMethodException extends BaseHttpError {
	constructor(data: any) {
		super('HTTP_ERROR_NOT_IMPLEMENTED_METHOD', 500, 2, data);
	}
}

/**
 * Exception for generic database error.
 */
export class GenericDatabaseException extends BaseHttpError {
	constructor(data: any) {
		super('GENERIC_DATABASE_ERROR', 500, 3, data);
	}
}
