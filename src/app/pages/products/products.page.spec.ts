import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsPage } from './products.page';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

describe('ProductsPage', () => {
  let component: ProductsPage;
  let fixture: ComponentFixture<ProductsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductsPage],
      imports: [
        IonicModule.forRoot(),      // Inicializa los componentes de Ionic
        RouterTestingModule,        // Simula el enrutamiento necesario
        ReactiveFormsModule,        // Soporte para formularios reactivos
        FormsModule,                // Soporte para formularios template-driven
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Aplica la detección de cambios inicial
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
