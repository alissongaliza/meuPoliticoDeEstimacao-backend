export class Proposition {
	private constructor(
		private _id: string,
		private _uri: string,
		private _ementa: string,
		private _authors: [],
		private _themes: []
	) {}

	static create(id: string, uri: string, ementa: string, authors: [] = [], themes: [] = []): Proposition {
		return new Proposition(id, uri, ementa, authors, themes);
	}

	get id(): string {
		return this._id;
	}

	set id(id: string) {
		this._id = id;
	}

	get uri(): string {
		return this._uri;
	}

	set uri(uri: string) {
		this._uri = uri;
	}

	get ementa(): string {
		return this._ementa;
	}

	set ementa(ementa: string) {
		this._ementa = ementa;
	}

	get authors(): [] {
		return this._authors;
	}

	set authors(authors: []) {
		this._authors = authors;
	}

	get themes(): [] {
		return this._themes;
	}

	set themes(themes: []) {
		this._themes = themes;
	}
}
