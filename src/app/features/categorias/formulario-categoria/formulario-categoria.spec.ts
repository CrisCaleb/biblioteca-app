import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioCategoria } from './formulario-categoria';

describe('FormularioCategoria', () => {
  let component: FormularioCategoria;
  let fixture: ComponentFixture<FormularioCategoria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioCategoria],
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioCategoria);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
