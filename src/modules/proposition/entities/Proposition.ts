import { Politician } from '../../politician/entities/Politician';
import { Theme } from '../../theme/entities/Theme';

export class Proposition {
	private constructor(
		private _id: string,
		private _uri: string,
		private _ementa: string,
		private _authors: Politician[],
		private _themes: Theme[]
	) {}

	static create(
		id: string,
		uri: string,
		ementa: string,
		authors: Politician[] = [],
		themes: Theme[] = []
	): Proposition {
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

	get authors(): Politician[] {
		return this._authors;
	}

	set authors(authors: Politician[]) {
		this._authors = authors;
	}

	get themes(): Theme[] {
		return this._themes;
	}

	set themes(themes: Theme[]) {
		this._themes = themes;
	}
}
