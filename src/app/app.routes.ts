import { Routes } from '@angular/router';

export const routes: Routes = [
  // 1. LA RUTA RAÍZ 
    {
        path: '',
        loadComponent: () => import('./features/home/home')
        .then(m => m.HomeComponent)
    },
    
    // 2. RUTAS DE LIBROS
    {
    path: 'libros',
    loadComponent: () => import('./features/libros/lista-libros/lista-libros')
        .then(m => m.ListaLibrosComponent)
    },
    {
    path: 'libros/nuevo',
    loadComponent: () => import('./features/libros/formulario-libro/formulario-libro')
        .then(m => m.FormularioLibroComponent)
    },
    {
    path: 'libros/editar/:id',
    loadComponent: () => import('./features/libros/formulario-libro/formulario-libro')
        .then(m => m.FormularioLibroComponent)
    },

  // 3. RUTAS DE AUTORES
    {
    path: 'autores',
    loadComponent: () => import('./features/autores/lista-autores/lista-autores')
        .then(m => m.ListaAutoresComponent)
    },
    {
    path: 'autores/nuevo',
    loadComponent: () => import('./features/autores/formulario-autor/formulario-autor')
        .then(m => m.FormularioAutorComponent)
    },
    {
    path: 'autores/editar/:id',
    loadComponent: () => import('./features/autores/formulario-autor/formulario-autor')
        .then(m => m.FormularioAutorComponent)
    },

  // 4. RUTAS DE CATEGORÍAS
    {
    path: 'categorias',
    loadComponent: () => import('./features/categorias/lista-categorias/lista-categorias')
        .then(m => m.ListaCategoriasComponent)
    },
    {
    path: 'categorias/nueva',
    loadComponent: () => import('./features/categorias/formulario-categoria/formulario-categoria')
        .then(m => m.FormularioCategoriaComponent)
    },
    {
    path: 'categorias/editar/:id',
    loadComponent: () => import('./features/categorias/formulario-categoria/formulario-categoria')
        .then(m => m.FormularioCategoriaComponent)
    },

  // 5. COMODÍN (Si escriben algo que no existe, los manda a home o libros)
    { path: '**', redirectTo: '', pathMatch: 'full' } 
];