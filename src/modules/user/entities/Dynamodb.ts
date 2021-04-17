export interface UserDynamodb {
	PK: string;
	SK: string;
	email: string;
	id: string;
	name: string;
	favoriteThemes: string[];
}

export interface FolloweeDynamodb {
	PK: string;
	SK: string;
	userId: string;
	politicianId: string;
	politicianName: string;
	politicianPhotoUrl: string;
	politicianPartyCode: string;
}
