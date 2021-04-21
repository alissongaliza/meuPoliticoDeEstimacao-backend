export class ConditionError extends Error {
	context = {};
	constructor(message: string, context = {}) {
		super(message);
		this.context = context;
	}
}
