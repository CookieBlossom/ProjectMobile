import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPassPage } from './forgot-pass.page';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

describe('ForgotPassPage', () => {
  let component: ForgotPassPage;
  let fixture: ComponentFixture<ForgotPassPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForgotPassPage],
      imports: [
        IonicModule.forRoot(),      // Inicializa Ionic
        RouterTestingModule,        // Simula el enrutamiento necesario
        ReactiveFormsModule,        // Soporte para formularios reactivos
        FormsModule,                // Soporte para formularios template-driven
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPassPage);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Aplica detección de cambios inicial
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
