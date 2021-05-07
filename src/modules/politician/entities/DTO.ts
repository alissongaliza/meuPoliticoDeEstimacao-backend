export interface PoliticianIdAndTheme {
	themeId: string;
	politiciansIds: string[];
}

export interface RelevantPoliticiansByTheme {
	firstTheme: PoliticianIdAndTheme;
	secondTheme: PoliticianIdAndTheme;
	thirdTheme: PoliticianIdAndTheme;
}

export interface FindRelevantPoliticiansByThemeDTO {
	orderedThemes: string[];
}
