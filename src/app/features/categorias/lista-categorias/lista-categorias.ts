import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Categoria } from '../../../core/models/categoria.model';
import { CategoriaService } from '../../../core/services/categoria.service';

@Component({
  selector: 'app-lista-categorias',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="card">
      <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
        <h4 class="mb-0"><i class="bi bi-tags"></i> Categorías</h4>
        <a routerLink="/categorias/nueva" class="btn btn-light btn-sm">
          <i class="bi bi-plus-circle"></i> Nueva Categoría
        </a>
      </div>
      <div class="card-body">
        @if (categorias().length > 0) {
          <div class="table-responsive">
            <table class="table table-striped table-hover">
              <thead class="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (categoria of categorias(); track categoria.id) {
                  <tr>
                    <td>{{ categoria.id }}</td>
                    <td>{{ categoria.nombre }}</td>
                    <td>{{ categoria.descripcion }}</td>
                    <td>
                      <a [routerLink]="['/categorias/editar', categoria.id]" 
                          class="btn btn-warning btn-sm me-2">
                        <i class="bi bi-pencil"></i> Editar
                      </a>
                      <button (click)="eliminar(categoria.id!)" 
                              class="btn btn-danger btn-sm">
                        <i class="bi bi-trash"></i> Eliminar
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        } @else {
          <div class="alert alert-info text-center">
            <i class="bi bi-info-circle"></i> No hay categorías registradas
          </div>
        }
      </div>
    </div>
  `
})
export class ListaCategoriasComponent implements OnInit {
  categorias = signal<Categoria[]>([]);

  constructor(private categoriaService: CategoriaService) {}

  async ngOnInit() {
    await this.cargarCategorias();
  }

  async cargarCategorias() {
    const data = await this.categoriaService.getAll();
    this.categorias.set(data);
  }

  async eliminar(id: number) {
    if (confirm('¿Está seguro de eliminar esta categoría?')) {
      try {
        await this.categoriaService.delete(id);
        await this.cargarCategorias();
      } catch (error) {
        alert('Error al eliminar la categoría');
        console.error(error);
      }
    }
  }
}