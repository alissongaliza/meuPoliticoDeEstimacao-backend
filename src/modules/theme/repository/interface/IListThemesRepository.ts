import { Theme } from '../../entities/Theme';

export interface IListThemesRepository {
	listThemes(): Promise<Theme[]>;
}
