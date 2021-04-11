import { Proposition } from '../../proposition/entities/Proposition';

export class Theme {
	private constructor(
		private _id: string,
		private _name: string,
		private _count: number,
		private _propositions: Proposition[]
	) {}

	static create(id: string, name: string, count = -1, propositions: Proposition[] = []): Theme {
		return new Theme(id, name, count, propositions);
	}

	get id(): string {
		return this._id;
	}

	set id(id: string) {
		this._id = id;
	}

	get name(): string {
		return this._name;
	}

	set name(name: string) {
		this._name = name;
	}

	get count(): number {
		return this._count;
	}

	set count(count: number) {
		this._count = count;
	}

	get propositions(): Proposition[] {
		return this._propositions;
	}

	set propositions(propositions: Proposition[]) {
		this._propositions = propositions;
	}
}
