import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoritesPage } from './favorites.page';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { ServiceBDService } from 'src/app/services/service-bd.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

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
      providers: [
        SQLite,                     // Agrega el provider para SQLite
        ServiceBDService,
        NativeStorage         // Agrega el ServiceBDService si depende de SQLite
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
