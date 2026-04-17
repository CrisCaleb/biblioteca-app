import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Libro } from '../../../core/models/libro.model';
import { LibroService } from '../../../core/services/libro.service';

@Component({
  selector: 'app-lista-libros',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="card">
      <div class="card-header bg-danger text-white d-flex justify-content-between align-items-center">
        <h4 class="mb-0"><i class="bi bi-book"></i> Libros</h4>
        <a routerLink="/libros/nuevo" class="btn btn-light btn-sm">
          <i class="bi bi-plus-circle"></i> Nuevo Libro
        </a>
      </div>
      <div class="card-body">
        @if (libros().length > 0) {
          <div class="table-responsive">
            <table class="table table-striped table-hover">
              <thead class="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>ISBN</th>
                  <th>Autor</th>
                  <th>Categoría</th>
                  <th>Año</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (libro of libros(); track libro.id) {
                  <tr>
                    <td>{{ libro.id }}</td>
                    <td><strong>{{ libro.titulo }}</strong></td>
                    <td>{{ libro.isbn }}</td>
                    <td>{{ libro.autor?.nombre }} {{ libro.autor?.apellido }}</td>
                    <td>
                      <span class="badge bg-secondary">{{ libro.categoria?.nombre }}</span>
                    </td>
                    <td>{{ libro.anioPublicacion }}</td>
                    <td>{{ libro.precio | currency:'Bs' }}</td>
                    <td>{{ libro.stock }}</td>
                    <td>
                      <a [routerLink]="['/libros/editar', libro.id]" 
                          class="btn btn-warning btn-sm me-1">
                        <i class="bi bi-pencil"></i>
                      </a>
                      <button (click)="eliminar(libro.id!)" 
                              class="btn btn-danger btn-sm">
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        } @else {
          <div class="alert alert-info text-center">
            <i class="bi bi-info-circle"></i> No hay libros registrados
          </div>
        }
      </div>
    </div>
  `
})
export class ListaLibrosComponent implements OnInit {
  libros = signal<Libro[]>([]);

  constructor(private libroService: LibroService) {}

  async ngOnInit() {
    await this.cargarLibros();
  }

  async cargarLibros() {
    const data = await this.libroService.getAll();
    this.libros.set(data);
  }

  async eliminar(id: number) {
    if (confirm('¿Está seguro de eliminar este libro?')) {
      try {
        await this.libroService.delete(id);
        await this.cargarLibros();
      } catch (error) {
        alert('Error al eliminar el libro');
        console.error(error);
      }
    }
  }
}