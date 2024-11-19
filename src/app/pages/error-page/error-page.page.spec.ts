import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorPagePage } from './error-page.page';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';

describe('ErrorPagePage', () => {
  let component: ErrorPagePage;
  let fixture: ComponentFixture<ErrorPagePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErrorPagePage],
      imports: [
        IonicModule.forRoot(), // Inicializa Ionic
        RouterTestingModule,   // Simula las rutas necesarias
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Aplica la detección de cambios inicial
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
