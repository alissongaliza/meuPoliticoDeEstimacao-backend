export class User {
	private constructor(private name: string, private email: string, private favoriteThemes: string[]) {}

	static create(name: string, email: string, favoriteThemes: string[]) {
		return new User(name, email, favoriteThemes);
	}
}
