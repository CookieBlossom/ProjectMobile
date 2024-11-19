import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapsPage } from './maps.page';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';

describe('MapsPage', () => {
  let component: MapsPage;
  let fixture: ComponentFixture<MapsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapsPage],
      imports: [
        IonicModule.forRoot(),      // Inicializa Ionic
        RouterTestingModule,        // Simula el enrutamiento necesario
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MapsPage);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Aplica detección de cambios inicial
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
