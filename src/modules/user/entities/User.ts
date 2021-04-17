import { Politician } from '../../politician/entities/Politician';

export class User {
	private constructor(
		private _name: string,
		private _email: string,
		private _favoriteThemes: string[],
		private _followedPoliticians: Politician[]
	) {}

	static create(name: string, email: string, favoriteThemes: string[], followedPoliticians: Politician[]): User {
		return new User(name, email, favoriteThemes, followedPoliticians);
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

	get favoriteThemes(): string[] {
		return this._favoriteThemes;
	}

	set favoriteThemes(favoriteThemes: string[]) {
		this._favoriteThemes = favoriteThemes;
	}

	get followedPoliticians(): Politician[] {
		return this._followedPoliticians;
	}

	set followedPoliticians(followedPoliticians: Politician[]) {
		this._followedPoliticians = followedPoliticians;
	}
}
