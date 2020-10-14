export class DBException {
	constructor(private readonly message: string, private readonly code: number) {}
}
