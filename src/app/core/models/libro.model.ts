import { Autor } from './autor.model';
import { Categoria } from './categoria.model';

export interface Libro {
    id?: number;
    titulo: string;
    isbn: string;
    anioPublicacion: number;
    precio: number;
    stock: number;
    autorId: number;
    categoriaId: number;
    // Campos virtuales para mostrar relaciones
    autor?: Autor;
    categoria?: Categoria;
}