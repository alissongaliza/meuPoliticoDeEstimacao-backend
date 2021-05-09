export interface PoliticiansIdAndTheme {
	themeId: string;
	politicians: { authorId: string; count: number }[];
}

export interface RelevantPoliticiansByTheme {
	firstTheme: PoliticiansIdAndTheme;
	secondTheme: PoliticiansIdAndTheme;
	thirdTheme: PoliticiansIdAndTheme;
}

export interface FindRelevantPoliticiansByThemeDTO {
	orderedThemes: string[];
}
