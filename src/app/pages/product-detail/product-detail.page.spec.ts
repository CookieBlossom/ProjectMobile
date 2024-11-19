import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDetailPage } from './product-detail.page';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

describe('ProductDetailPage', () => {
  let component: ProductDetailPage;
  let fixture: ComponentFixture<ProductDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductDetailPage],
      imports: [
        IonicModule.forRoot(),      // Inicializa los componentes de Ionic
        RouterTestingModule,        // Simula el enrutamiento necesario
        FormsModule,                // Soporte para formularios template-driven
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Aplica la detección de cambios inicial
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
