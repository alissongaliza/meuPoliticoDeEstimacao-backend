export interface CreateUserDTO {
	name: string;
	email: string;
	favoriteThemes: string[];
}

export type UpdateUserDTO = Partial<CreateUserDTO>;

export interface RankThemesDTO {
	newFavoriteThemes: string[];
	oldFavoriteThemes: string[];
}

export interface Followee {
	id: string;
	name: string;
	photoUrl: string;
	partyCode: string;
}
export interface FollowPoliticiansDTO {
	followees: Followee[];
}
