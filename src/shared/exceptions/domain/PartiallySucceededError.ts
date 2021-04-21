export class PartiallySucceededError extends Error {
	succeeded = [];
	failed = [];
	constructor(message: string, succeeded = [], failed = []) {
		super(message);
		this.succeeded = succeeded;
		this.failed = failed;
	}
}
