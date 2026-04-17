import { Injectable } from '@angular/core';
import { IndexeddbService } from './indexeddb.service';
import { Autor } from '../models/autor.model';

@Injectable({ providedIn: 'root' })
export class AutorService {
    private readonly STORE = 'autores';

    constructor(private db: IndexeddbService) {}

    async getAll(): Promise<Autor[]> {
        return this.db.getAll<Autor>(this.STORE);
    }

    async getById(id: number): Promise<Autor | undefined> {
        return this.db.getById<Autor>(this.STORE, id);
    }

    async create(autor: Omit<Autor, 'id'>): Promise<number> {
        return this.db.add<Autor>(this.STORE, autor);
    }

    async update(autor: Autor & { id: number }): Promise<void> {
        await this.db.update<Autor>(this.STORE, autor);
    }

    async delete(id: number): Promise<void> {
        await this.db.delete(this.STORE, id);
    }
}