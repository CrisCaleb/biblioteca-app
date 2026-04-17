import { Injectable } from '@angular/core';
import { IndexeddbService } from './indexeddb.service';
import { Autor } from '../models/autor.model';

@Injectable({ providedIn: 'root' })
export class AutorService {
    constructor(private db: IndexeddbService) {}

    async getAll(): Promise<Autor[]> {
        return this.db.getAllAutores();
    }

    async getById(id: number): Promise<Autor | undefined> {
        return this.db.getAutorById(id);
    }

    async create(autor: Omit<Autor, 'id'>): Promise<number> {
        return this.db.addAutor(autor);
    }

    async update(autor: Autor): Promise<void> {
        await this.db.updateAutor(autor);
    }

    async delete(id: number): Promise<void> {
        await this.db.deleteAutor(id);
    }
}