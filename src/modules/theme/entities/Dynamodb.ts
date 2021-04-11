export interface ThemeDynamodb {
	PK: string;
	SK: string;
	name: string;
}

export interface ThemesDynamodb {
	PK: string;
	SK: string;
	themes: Record<string, { id: string; name: string; count: number }>;
}
