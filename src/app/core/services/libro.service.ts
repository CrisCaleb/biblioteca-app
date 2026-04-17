import { Injectable } from '@angular/core';
import { IndexeddbService } from './indexeddb.service';
import { Libro } from '../models/libro.model';
import { AutorService } from './autor.service';
import { CategoriaService } from './categoria.service';

@Injectable({ providedIn: 'root' })
export class LibroService {
    private readonly STORE = 'libros';

    constructor(
        private db: IndexeddbService,
        private autorService: AutorService,
        private categoriaService: CategoriaService
    ) {}

    private async cargarRelaciones(libro: Libro): Promise<Libro> {
        if (libro.autorId) {
        libro.autor = await this.autorService.getById(libro.autorId);
        }
        if (libro.categoriaId) {
        libro.categoria = await this.categoriaService.getById(libro.categoriaId);
        }
        return libro;
    }

    async getAll(): Promise<Libro[]> {
        const libros = await this.db.getAll<Libro>(this.STORE);
        // Cargar relaciones para cada libro
        for (const libro of libros) {
        await this.cargarRelaciones(libro);
        }
        return libros;
    }

    async getById(id: number): Promise<Libro | undefined> {
        const libro = await this.db.getById<Libro>(this.STORE, id);
        if (libro) {
        await this.cargarRelaciones(libro);
        }
        return libro;
    }

    async create(libro: Omit<Libro, 'id'>): Promise<number> {
        return this.db.add<Libro>(this.STORE, libro);
    }

    async update(libro: Libro & { id: number }): Promise<void> {
        await this.db.update<Libro>(this.STORE, libro);
    }

    async delete(id: number): Promise<void> {
        await this.db.delete(this.STORE, id);
    }

    async getByAutor(autorId: number): Promise<Libro[]> {
        return this.db.getByIndex<Libro>(this.STORE, 'by-autor', autorId);
    }

    async getByCategoria(categoriaId: number): Promise<Libro[]> {
        return this.db.getByIndex<Libro>(this.STORE, 'by-categoria', categoriaId);
    }
}