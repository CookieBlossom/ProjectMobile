import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdmModifyPage } from './adm-modify.page';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { ServiceBDService } from 'src/app/services/service-bd.service';

describe('AdmModifyPage', () => {
  let component: AdmModifyPage;
  let fixture: ComponentFixture<AdmModifyPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdmModifyPage], // Declara el componente a probar
      imports: [
        IonicModule.forRoot(), // IonicModule para que las dependencias de Ionic se carguen correctamente
        RouterTestingModule,   // Simula el RouterModule para pruebas
        ReactiveFormsModule,   // Habilita los formularios reactivos
        FormsModule,           // Soporte para formularios template-driven
        HttpClientTestingModule, // Simula HttpClient para evitar solicitudes HTTP reales
      ],
      providers: [
        NativeStorage, // Proveedor para simulación de NativeStorage
        SQLite,
        ServiceBDService    // Proveedor para simulación de SQLite
      ],
    }).compileComponents(); // Compila los componentes necesarios

    // Inicializa el componente y su fixture
    fixture = TestBed.createComponent(AdmModifyPage);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Aplica la detección de cambios inicial
  });

  it('should create the app', () => {
    expect(component).toBeTruthy(); // Usa el componente inicializado
  });
});
