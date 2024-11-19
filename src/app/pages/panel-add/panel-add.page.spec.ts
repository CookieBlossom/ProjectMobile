import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PanelAddPage } from './panel-add.page';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

describe('PanelAddPage', () => {
  let component: PanelAddPage;
  let fixture: ComponentFixture<PanelAddPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PanelAddPage],
      imports: [
        IonicModule.forRoot(),      // Inicializa los componentes de Ionic
        RouterTestingModule,        // Simula el enrutamiento necesario
        FormsModule,                // Soporte para formularios template-driven
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PanelAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Aplica la detección de cambios inicial
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
