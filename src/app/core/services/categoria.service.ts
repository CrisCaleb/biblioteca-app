import { Injectable } from '@angular/core';
import { IndexeddbService } from './indexeddb.service';
import { Categoria } from '../models/categoria.model';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
    private readonly STORE = 'categorias';

    constructor(private db: IndexeddbService) {}

    async getAll(): Promise<Categoria[]> {
        return this.db.getAll<Categoria>(this.STORE);
    }

    async getById(id: number): Promise<Categoria | undefined> {
        return this.db.getById<Categoria>(this.STORE, id);
    }

    async create(categoria: Omit<Categoria, 'id'>): Promise<number> {
        return this.db.add<Categoria>(this.STORE, categoria);
    }

    async update(categoria: Categoria & { id: number }): Promise<void> {
        await this.db.update<Categoria>(this.STORE, categoria);
    }

    async delete(id: number): Promise<void> {
        await this.db.delete(this.STORE, id);
    }
}