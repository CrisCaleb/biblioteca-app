import { Injectable } from '@angular/core';
import { IndexeddbService } from './indexeddb.service';
import { Categoria } from '../models/categoria.model';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
    constructor(private db: IndexeddbService) {}

    async getAll(): Promise<Categoria[]> {
        return this.db.getAllCategorias();
    }

    async getById(id: number): Promise<Categoria | undefined> {
        return this.db.getCategoriaById(id);
    }

    async create(categoria: Omit<Categoria, 'id'>): Promise<number> {
        return this.db.addCategoria(categoria);
    }

    async update(categoria: Categoria): Promise<void> {
        await this.db.updateCategoria(categoria);
    }

    async delete(id: number): Promise<void> {
        await this.db.deleteCategoria(id);
    }
}