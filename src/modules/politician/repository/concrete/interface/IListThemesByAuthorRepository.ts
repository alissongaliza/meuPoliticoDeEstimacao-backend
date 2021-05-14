import { ListThemesByAuthorDTO } from '../../../entities/DTO';

export interface IListThemesByAuthorRepository {
	listThemesByAuthor(id: string): Promise<ListThemesByAuthorDTO[]>;
}
