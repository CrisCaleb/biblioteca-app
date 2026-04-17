import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Autor } from '../models/autor.model';
import { Categoria } from '../models/categoria.model';
import { Libro } from '../models/libro.model';

// Definición del esquema de la base de datos
interface BibliotecaDB extends DBSchema {
    autores: {
        key: number;
        value: Autor;
    };
    categorias: {
        key: number;
        value: Categoria;
    };
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

    // Inicializar la base de datos
    private async getDB(): Promise<IDBPDatabase<BibliotecaDB>> {
        if (this.db) return this.db;

        this.db = await openDB<BibliotecaDB>(this.DB_NAME, this.DB_VERSION, {
        upgrade(db) {
            // Store: Autores
            if (!db.objectStoreNames.contains('autores')) {
            db.createObjectStore('autores', { keyPath: 'id', autoIncrement: true });
            }
            // Store: Categorías
            if (!db.objectStoreNames.contains('categorias')) {
            db.createObjectStore('categorias', { keyPath: 'id', autoIncrement: true });
            }
            // Store: Libros (con índices para búsquedas)
            if (!db.objectStoreNames.contains('libros')) {
            const libroStore = db.createObjectStore('libros', { 
                keyPath: 'id', 
                autoIncrement: true 
            });
            libroStore.createIndex('by-autor', 'autorId');
            libroStore.createIndex('by-categoria', 'categoriaId');
            }
        }
        });
        return this.db;
    }

    // === Métodos genéricos CRUD ===
    async getAll<T>(store: string): Promise<T[]> {
        const db = await this.getDB();
        return db.getAll(store);
    }

    async getById<T>(store: string, id: number): Promise<T | undefined> {
        const db = await this.getDB();
        return db.get(store, id);
    }

    async add<T>(store: string, item: Omit<T, 'id'>): Promise<number> {
        const db = await this.getDB();
        return db.add(store, item as any);
    }

    async update<T>(store: string, item: T & { id: number }): Promise<void> {
        const db = await this.getDB();
        await db.put(store, item as any);
    }

    async delete(store: string, id: number): Promise<void> {
        const db = await this.getDB();
        await db.delete(store, id);
    }

    async getByIndex<T>(store: string, index: string, value: any): Promise<T[]> {
        const db = await this.getDB();
        return db.getAllFromIndex(store, index, value);
    }
}