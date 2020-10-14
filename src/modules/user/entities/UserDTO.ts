import { UserDynamodb, User } from './User';

export interface CreateUserDTO {
	name: string;
	email: string;
	favoriteThemes: string[];
}

export interface UpdateUserDTO extends CreateUserDTO {
	id: string;
}

export const userDynamodbToUser = ({ data, entity, email, favoriteThemes }: UserDynamodb): User => ({
	email,
	id: entity,
	name: data,
	favoriteThemes,
});
