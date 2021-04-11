export class User {
	private constructor(private _name: string, private _email: string, private _favoriteThemes: string[]) {}

	static create(name: string, email: string, favoriteThemes: string[]): User {
		return new User(name, email, favoriteThemes);
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
}
