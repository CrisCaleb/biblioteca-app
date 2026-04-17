import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Autor } from '../models/autor.model';
import { Categoria } from '../models/categoria.model';
import { Libro } from '../models/libro.model';

interface BibliotecaDB extends DBSchema {
    autores: { key: number; value: Autor };
    categorias: { key: number; value: Categoria };
    libros: { 
        key: number; 
        value: Libro;
        indexes: { 'by-autor': number; 'by-categoria': number };
    };
}

@Injectable({ providedIn: 'root' })
export class IndexeddbService {
    private readonly DB_NAME = 'BibliotecaDB';
    private readonly DB_VERSION = 1;
    private db: IDBPDatabase<BibliotecaDB> | null = null;

    private async getDB(): Promise<IDBPDatabase<BibliotecaDB>> {
        if (this.db) return this.db;
        this.db = await openDB<BibliotecaDB>(this.DB_NAME, this.DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('autores')) {
            db.createObjectStore('autores', { keyPath: 'id', autoIncrement: true });
            }
            if (!db.objectStoreNames.contains('categorias')) {
            db.createObjectStore('categorias', { keyPath: 'id', autoIncrement: true });
            }
            if (!db.objectStoreNames.contains('libros')) {
            const store = db.createObjectStore('libros', { keyPath: 'id', autoIncrement: true });
            store.createIndex('by-autor', 'autorId');
            store.createIndex('by-categoria', 'categoriaId');
            }
        }
        });
        return this.db;
    }

    // === AUTORES ===
    async getAllAutores(): Promise<Autor[]> {
        const db = await this.getDB();
        return db.getAll('autores');
    }

    async getAutorById(id: number): Promise<Autor | undefined> {
        const db = await this.getDB();
        return db.get('autores', id);
    }

    async addAutor(autor: Omit<Autor, 'id'>): Promise<number> {
        const db = await this.getDB();
        return db.add('autores', autor as any);
    }

    async updateAutor(autor: Autor): Promise<void> {
        const db = await this.getDB();
        await db.put('autores', autor);
    }

    async deleteAutor(id: number): Promise<void> {
        const db = await this.getDB();
        await db.delete('autores', id);
    }

    // === CATEGORIAS ===
    async getAllCategorias(): Promise<Categoria[]> {
        const db = await this.getDB();
        return db.getAll('categorias');
    }

    async getCategoriaById(id: number): Promise<Categoria | undefined> {
        const db = await this.getDB();
        return db.get('categorias', id);
    }

    async addCategoria(categoria: Omit<Categoria, 'id'>): Promise<number> {
        const db = await this.getDB();
        return db.add('categorias', categoria as any);
    }

    async updateCategoria(categoria: Categoria): Promise<void> {
        const db = await this.getDB();
        await db.put('categorias', categoria);
    }

    async deleteCategoria(id: number): Promise<void> {
        const db = await this.getDB();
        await db.delete('categorias', id);
    }

    // === LIBROS ===
    async getAllLibros(): Promise<Libro[]> {
        const db = await this.getDB();
        return db.getAll('libros');
    }

    async getLibroById(id: number): Promise<Libro | undefined> {
        const db = await this.getDB();
        return db.get('libros', id);
    }

    async addLibro(libro: Omit<Libro, 'id'>): Promise<number> {
        const db = await this.getDB();
        return db.add('libros', libro as any);
    }

    async updateLibro(libro: Libro): Promise<void> {
        const db = await this.getDB();
        await db.put('libros', libro);
    }

    async deleteLibro(id: number): Promise<void> {
        const db = await this.getDB();
        await db.delete('libros', id);
    }

    async getLibrosByAutor(autorId: number): Promise<Libro[]> {
        const db = await this.getDB();
        return db.getAllFromIndex('libros', 'by-autor', autorId);
    }

    async getLibrosByCategoria(categoriaId: number): Promise<Libro[]> {
        const db = await this.getDB();
        return db.getAllFromIndex('libros', 'by-categoria', categoriaId);
    }
}