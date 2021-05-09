export interface AuthorDynamodb {
	PK: string;
	SK: string;
	politicianId: string;
	propositionId: string;
}

export interface AuthorThemeDynamodb {
	PK: string;
	SK: string;
	themeId: string;
	authorId: string;
	GSI1PK: string;
	GSI1SK: string;
	count: number;
}
