import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Autor } from '../../../core/models/autor.model';
import { AutorService } from '../../../core/services/autor.service';

@Component({
  selector: 'app-lista-autores',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="card">
      <div class="card-header bg-info text-white d-flex justify-content-between align-items-center">
        <h4 class="mb-0"><i class="bi bi-person"></i> Autores</h4>
        <a routerLink="/autores/nuevo" class="btn btn-light btn-sm">
          <i class="bi bi-plus-circle"></i> Nuevo Autor
        </a>
      </div>
      <div class="card-body">
        @if (autores().length > 0) {
          <div class="table-responsive">
            <table class="table table-striped table-hover">
              <thead class="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Nacionalidad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (autor of autores(); track autor.id) {
                  <tr>
                    <td>{{ autor.id }}</td>
                    <td>{{ autor.nombre }}</td>
                    <td>{{ autor.apellido }}</td>
                    <td>{{ autor.nacionalidad }}</td>
                    <td>
                      <a [routerLink]="['/autores/editar', autor.id]" 
                         class="btn btn-warning btn-sm me-2">
                        <i class="bi bi-pencil"></i> Editar
                      </a>
                      <button (click)="eliminar(autor.id!)" 
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
            <i class="bi bi-info-circle"></i> No hay autores registrados
          </div>
        }
      </div>
    </div>
  `
})
export class ListaAutoresComponent implements OnInit {
  autores = signal<Autor[]>([]);

  constructor(private autorService: AutorService) {}

  async ngOnInit() {
    await this.cargarAutores();
  }

  async cargarAutores() {
    const data = await this.autorService.getAll();
    this.autores.set(data);
  }

  async eliminar(id: number) {
    if (confirm('¿Está seguro de eliminar este autor?')) {
      try {
        await this.autorService.delete(id);
        await this.cargarAutores();
      } catch (error) {
        alert('Error al eliminar el autor');
        console.error(error);
      }
    }
  }
}