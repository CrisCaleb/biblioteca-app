import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'libros', pathMatch: 'full' },
    
    // Rutas Categorías
    {
        path: 'categorias',
        loadComponent: () => import('./features/categorias/lista-categorias/lista-categorias.component')
        .then(m => m.ListaCategoriasComponent)
    },
    {
        path: 'categorias/nueva',
        loadComponent: () => import('./features/categorias/formulario-categoria/formulario-categoria.component')
        .then(m => m.FormularioCategoriaComponent)
    },
    {
        path: 'categorias/editar/:id',
        loadComponent: () => import('./features/categorias/formulario-categoria/formulario-categoria.component')
        .then(m => m.FormularioCategoriaComponent)
    },
    
    // Rutas Autores
    {
        path: 'autores',
        loadComponent: () => import('./features/autores/lista-autores/lista-autores.component')
        .then(m => m.ListaAutoresComponent)
    },
    {
        path: 'autores/nuevo',
        loadComponent: () => import('./features/autores/formulario-autor/formulario-autor.component')
        .then(m => m.FormularioAutorComponent)
    },
    {
        path: 'autores/editar/:id',
        loadComponent: () => import('./features/autores/formulario-autor/formulario-autor.component')
        .then(m => m.FormularioAutorComponent)
    },
    
    // Rutas Libros
    {
        path: 'libros',
        loadComponent: () => import('./features/libros/lista-libros/lista-libros.component')
        .then(m => m.ListaLibrosComponent)
    },
    {
        path: 'libros/nuevo',
        loadComponent: () => import('./features/libros/formulario-libro/formulario-libro.component')
        .then(m => m.FormularioLibroComponent)
    },
    {
        path: 'libros/editar/:id',
        loadComponent: () => import('./features/libros/formulario-libro/formulario-libro.component')
        .then(m => m.FormularioLibroComponent)
    },
    
    { path: '**', redirectTo: 'libros' }
];