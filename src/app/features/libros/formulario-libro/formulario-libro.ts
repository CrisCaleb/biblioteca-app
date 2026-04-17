import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { LibroService } from '../../../core/services/libro.service';
import { AutorService } from '../../../core/services/autor.service';
import { CategoriaService } from '../../../core/services/categoria.service';
import { Libro } from '../../../core/models/libro.model';
import { Autor } from '../../../core/models/autor.model';
import { Categoria } from '../../../core/models/categoria.model';

@Component({
  selector: 'app-formulario-libro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="card">
      <div class="card-header bg-danger text-white">
        <h4 class="mb-0">
          {{ isEditMode() ? '✏️ Editar Libro' : '➕ Nuevo Libro' }}
        </h4>
      </div>
      <div class="card-body">
        <form (ngSubmit)="guardar()">
          <div class="mb-3">
            <label class="form-label">Título *</label>
            <input 
              type="text" 
              class="form-control" 
              [(ngModel)]="libro().titulo"
              name="titulo"
              required
              placeholder="Título del libro">
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">ISBN *</label>
              <input 
                type="text" 
                class="form-control" 
                [(ngModel)]="libro().isbn"
                name="isbn"
                required
                placeholder="Ej: 978-3-16-148410-0">
            </div>
            
            <div class="col-md-6 mb-3">
              <label class="form-label">Año de Publicación *</label>
              <input 
                type="number" 
                class="form-control" 
                [(ngModel)]="libro().anioPublicacion"
                name="anioPublicacion"
                required
                min="1900"
                max="2099">
            </div>
          </div>

          <div class="row">
            <div class="col-md-4 mb-3">
              <label class="form-label">Precio (Bs) *</label>
              <input 
                type="number" 
                class="form-control" 
                [(ngModel)]="libro().precio"
                name="precio"
                required
                min="0"
                step="0.01">
            </div>
            
            <div class="col-md-4 mb-3">
              <label class="form-label">Stock *</label>
              <input 
                type="number" 
                class="form-control" 
                [(ngModel)]="libro().stock"
                name="stock"
                required
                min="0">
            </div>

            <div class="col-md-4 mb-3">
              <label class="form-label">Autor *</label>
              <select 
                class="form-select" 
                [(ngModel)]="libro().autorId"
                name="autorId"
                required>
                <option [ngValue]="0">Seleccione un autor</option>
                @for (autor of autores(); track autor.id) {
                  <option [ngValue]="autor.id">
                    {{ autor.nombre }} {{ autor.apellido }}
                  </option>
                }
              </select>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Categoría *</label>
            <select 
              class="form-select" 
              [(ngModel)]="libro().categoriaId"
              name="categoriaId"
              required>
              <option [ngValue]="0">Seleccione una categoría</option>
              @for (categoria of categorias(); track categoria.id) {
                <option [ngValue]="categoria.id">
                  {{ categoria.nombre }}
                </option>
              }
            </select>
          </div>

          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-danger">
              <i class="bi bi-check-circle"></i> Guardar
            </button>
            <a routerLink="/libros" class="btn btn-secondary">
              <i class="bi bi-x-circle"></i> Cancelar
            </a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class FormularioLibroComponent implements OnInit {
  libro = signal<Partial<Libro>>({
    titulo: '',
    isbn: '',
    anioPublicacion: new Date().getFullYear(),
    precio: 0,
    stock: 0,
    autorId: 0,
    categoriaId: 0
  });
  autores = signal<Autor[]>([]);
  categorias = signal<Categoria[]>([]);
  isEditMode = signal(false);
  libroId = signal<number | null>(null);

  constructor(
    private libroService: LibroService,
    private autorService: AutorService,
    private categoriaService: CategoriaService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    await Promise.all([
      this.cargarAutores(),
      this.cargarCategorias()
    ]);

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.libroId.set(+id);
      const libro = await this.libroService.getById(+id);
      if (libro) {
        this.libro.set({ 
          ...libro,
          autorId: libro.autorId || 0,
          categoriaId: libro.categoriaId || 0
        });
      }
    }
  }

  async cargarAutores() {
    const data = await this.autorService.getAll();
    this.autores.set(data);
  }

  async cargarCategorias() {
    const data = await this.categoriaService.getAll();
    this.categorias.set(data);
  }

  // ... en el método guardar() ...

async guardar() {
  if (!this.libro().titulo || !this.libro().isbn || 
      this.libro().autorId === 0 || this.libro().categoriaId === 0) {
    alert('Todos los campos obligatorios deben estar completos');
    return;
  }

  try {
    if (this.isEditMode() && this.libroId()) {
      const libroActualizado: Libro = {
        id: this.libroId()!,
        titulo: this.libro().titulo!,
        isbn: this.libro().isbn!,
        anioPublicacion: this.libro().anioPublicacion!,
        precio: this.libro().precio!,
        stock: this.libro().stock!,
        autorId: this.libro().autorId!,
        categoriaId: this.libro().categoriaId!
      };
      await this.libroService.update(libroActualizado);
    } else {
      await this.libroService.create(this.libro() as Omit<Libro, 'id'>);
    }
    this.router.navigate(['/libros']);
  } catch (error) {
    alert('Error al guardar el libro');
    console.error(error);
  }
} 
}