import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoritesPage } from './favorites.page';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

describe('FavoritesPage', () => {
  let component: FavoritesPage;
  let fixture: ComponentFixture<FavoritesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FavoritesPage],
      imports: [
        IonicModule.forRoot(), // Inicializa Ionic
        RouterTestingModule,   // Simula el enrutamiento necesario
        FormsModule,           // Importa soporte para formularios
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritesPage);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Aplica detección de cambios inicial
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
