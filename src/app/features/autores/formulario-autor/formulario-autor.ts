import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AutorService } from '../../../core/services/autor.service';
import { Autor } from '../../../core/models/autor.model';

@Component({
  selector: 'app-formulario-autor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="card">
      <div class="card-header bg-info text-white">
        <h4 class="mb-0">
          {{ isEditMode() ? '✏️ Editar Autor' : '➕ Nuevo Autor' }}
        </h4>
      </div>
      <div class="card-body">
        <form (ngSubmit)="guardar()">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Nombre *</label>
              <input 
                type="text" 
                class="form-control" 
                [(ngModel)]="autor().nombre"
                name="nombre"
                required
                placeholder="Nombre del autor">
            </div>
            
            <div class="col-md-6 mb-3">
              <label class="form-label">Apellido *</label>
              <input 
                type="text" 
                class="form-control" 
                [(ngModel)]="autor().apellido"
                name="apellido"
                required
                placeholder="Apellido del autor">
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Nacionalidad</label>
            <input 
              type="text" 
              class="form-control" 
              [(ngModel)]="autor().nacionalidad"
              name="nacionalidad"
              placeholder="Ej: Colombiana">
          </div>

          <div class="mb-3">
            <label class="form-label">Fecha de Nacimiento</label>
            <input 
              type="date" 
              class="form-control" 
              [(ngModel)]="autor().fechaNacimiento"
              name="fechaNacimiento">
          </div>

          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-primary">
              <i class="bi bi-check-circle"></i> Guardar
            </button>
            <a routerLink="/autores" class="btn btn-secondary">
              <i class="bi bi-x-circle"></i> Cancelar
            </a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class FormularioAutorComponent implements OnInit {
  autor = signal<Partial<Autor>>({
    nombre: '',
    apellido: '',
    nacionalidad: '',
    fechaNacimiento: ''
  });
  isEditMode = signal(false);
  autorId = signal<number | null>(null);

  constructor(
    private autorService: AutorService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.autorId.set(+id);
      const autor = await this.autorService.getById(+id);
      if (autor) {
        this.autor.set({ ...autor });
      }
    }
  }

  async guardar() {
  if (!this.autor().nombre || !this.autor().apellido) {
    alert('Nombre y apellido son obligatorios');
    return;
  }

  try {
    if (this.isEditMode() && this.autorId()) {
      const autorActualizado: Autor = {
        id: this.autorId()!,
        nombre: this.autor().nombre!,
        apellido: this.autor().apellido!,
        nacionalidad: this.autor().nacionalidad || '',
        fechaNacimiento: this.autor().fechaNacimiento || ''
      };
      
      await this.autorService.update(autorActualizado);
    } else {
      await this.autorService.create(this.autor() as Omit<Autor, 'id'>);
    }
    this.router.navigate(['/autores']);
  } catch (error) {
    alert('Error al guardar el autor');
    console.error(error);
  }
}