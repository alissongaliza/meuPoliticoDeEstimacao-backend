export interface CreateUserDTO {
	name: string;
	email: string;
	favoriteThemes: string[];
}

export interface UpdateUserDTO extends CreateUserDTO {
	id: string;
}
