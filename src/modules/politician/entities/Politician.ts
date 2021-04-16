import { Proposition } from '../../proposition/entities/Proposition';

export class Politician {
	private constructor(
		private _id: string,
		private _name: string,
		private _uri: string,
		private _email: string,
		private _photoUrl: string,
		private _stateCode: string,
		private _partyCode: string,
		private _partyUri: string,
		private _propositions: Proposition[]
	) {}

	static create(
		id: string,
		name: string,
		uri: string,
		email: string,
		photoUrl: string,
		stateCode: string,
		partyCode: string,
		partyUri: string,
		propositions: Proposition[] = []
	): Politician {
		return new Politician(id, name, uri, email, photoUrl, stateCode, partyCode, partyUri, propositions);
	}

	get id(): string {
		return this._id;
	}

	set id(id: string) {
		this._id = id;
	}

	get uri(): string {
		return this._uri;
	}

	set uri(uri: string) {
		this._uri = uri;
	}

	get name(): string {
		return this._name;
	}

	set name(name: string) {
		this._name = name;
	}

	get email(): string {
		return this._email;
	}

	set email(email: string) {
		this._email = email;
	}

	get photoUrl(): string {
		return this._photoUrl;
	}

	set photoUrl(photoUrl: string) {
		this._photoUrl = photoUrl;
	}

	get stateCode(): string {
		return this._stateCode;
	}

	set stateCode(stateCode: string) {
		this._stateCode = stateCode;
	}

	get partyCode(): string {
		return this._partyCode;
	}

	set partyCode(partyCode: string) {
		this._partyCode = partyCode;
	}

	get partyUri(): string {
		return this._partyUri;
	}

	set partyUri(partyUri: string) {
		this._partyUri = partyUri;
	}

	get propositions(): Proposition[] {
		return this._propositions;
	}

	set propositions(propositions: Proposition[]) {
		this._propositions = propositions;
	}
}
