export interface User {
	id: string;
	name: string;
	email: string;
	favoriteThemes: string[];
}

export interface UserDynamodb {
	entity: string;
	data: string;
	email: string;
	favoriteThemes: string[];
}
