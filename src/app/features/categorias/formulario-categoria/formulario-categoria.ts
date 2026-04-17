import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CategoriaService } from '../../../core/services/categoria.service';
import { Categoria } from '../../../core/models/categoria.model';

@Component({
  selector: 'app-formulario-categoria',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="card">
      <div class="card-header bg-primary text-white">
        <h4 class="mb-0">
          {{ isEditMode() ? '✏️ Editar Categoría' : '➕ Nueva Categoría' }}
        </h4>
      </div>
      <div class="card-body">
        <form (ngSubmit)="guardar()">
          <div class="mb-3">
            <label class="form-label">Nombre *</label>
            <input 
              type="text" 
              class="form-control" 
              [(ngModel)]="categoria().nombre"
              name="nombre"
              required
              placeholder="Ej: Novela">
          </div>
          
          <div class="mb-3">
            <label class="form-label">Descripción</label>
            <textarea 
              class="form-control" 
              [(ngModel)]="categoria().descripcion"
              name="descripcion"
              rows="3"
              placeholder="Descripción de la categoría"></textarea>
          </div>

          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-success">
              <i class="bi bi-check-circle"></i> Guardar
            </button>
            <a routerLink="/categorias" class="btn btn-secondary">
              <i class="bi bi-x-circle"></i> Cancelar
            </a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class FormularioCategoriaComponent implements OnInit {
  // ✅ DECLARACIÓN CORRECTA DEL SIGNAL
  categoria = signal<Partial<Categoria>>({
    nombre: '',
    descripcion: ''
  });
  
  isEditMode = signal(false);
  categoriaId = signal<number | null>(null);

  constructor(
    private categoriaService: CategoriaService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.categoriaId.set(+id);
      const categoria = await this.categoriaService.getById(+id);
      if (categoria) {
        this.categoria.set({ ...categoria });
      }
    }
  }


async guardar() {
  if (!this.categoria().nombre) {
    alert('El nombre es obligatorio');
    return;
  }

  try {
      if (this.isEditMode() && this.categoriaId()) {
        const categoriaActualizada: Categoria = {
          id: this.categoriaId()!,
          nombre: this.categoria().nombre!,
          descripcion: this.categoria().descripcion || ''
        };
        await this.categoriaService.update(categoriaActualizada);
      } else {
        await this.categoriaService.create(this.categoria() as Omit<Categoria, 'id'>);
      }
      this.router.navigate(['/categorias']);
    } catch (error) {
      alert('Error al guardar la categoría');
      console.error(error);
    }
  }
}
