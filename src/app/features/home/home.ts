// src/app/features/home/home.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LibroService } from '../../core/services/libro.service';
import { AutorService } from '../../core/services/autor.service';
import { CategoriaService } from '../../core/services/categoria.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  totalLibros = signal(0);
  totalAutores = signal(0);
  totalCategorias = signal(0);

  constructor(
    private libroService: LibroService,
    private autorService: AutorService,
    private categoriaService: CategoriaService
  ) {}

  async ngOnInit() {
    await this.cargarEstadisticas();
  }

  async cargarEstadisticas() {
    const [libros, autores, categorias] = await Promise.all([
      this.libroService.getAll(),
      this.autorService.getAll(),
      this.categoriaService.getAll()
    ]);
    this.totalLibros.set(libros.length);
    this.totalAutores.set(autores.length);
    this.totalCategorias.set(categorias.length);
  }
}