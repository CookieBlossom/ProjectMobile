import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdmProductsPage } from './adm-products.page';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular';

describe('AdmProductsPage', () => {
  let component: AdmProductsPage;
  let fixture: ComponentFixture<AdmProductsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdmProductsPage],
      imports: [
        IonicModule.forRoot(), // Inicializa los componentes de Ionic
        RouterTestingModule,   // Simula el enrutamiento necesario
        FormsModule,           // Soporte para formularios
      ],
      providers: [
        AlertController,       // Provee AlertController utilizado en el componente
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdmProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Aplica la detección de cambios inicial
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
