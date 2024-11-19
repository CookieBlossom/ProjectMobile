import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShoppingCartPage } from './shopping-cart.page';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';

describe('ShoppingCartPage', () => {
  let component: ShoppingCartPage;
  let fixture: ComponentFixture<ShoppingCartPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShoppingCartPage],
      imports: [
        IonicModule.forRoot(),      // Inicializa los componentes de Ionic
        RouterTestingModule,        // Simula el enrutamiento necesario
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShoppingCartPage);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Aplica la detección de cambios inicial
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
