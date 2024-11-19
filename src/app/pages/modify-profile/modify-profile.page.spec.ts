import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModifyProfilePage } from './modify-profile.page';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { ServiceBDService } from 'src/app/services/service-bd.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

describe('ModifyProfilePage', () => {
  let component: ModifyProfilePage;
  let fixture: ComponentFixture<ModifyProfilePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifyProfilePage],
      imports: [
        IonicModule.forRoot(),      // Inicializa los componentes de Ionic
        RouterTestingModule,        // Simula el enrutamiento necesario
        FormsModule,                // Soporte para formularios template-driven
        ReactiveFormsModule,        // Soporte para formularios reactivos
        MatFormFieldModule,         // Campo de formulario de Angular Material
        MatInputModule,             // Entrada de datos de Angular Material
        MatButtonModule,            // Botones de Angular Material
        MatCardModule,              // Tarjetas de Angular Material
        MatSnackBarModule,          // Snackbar de Angular Material
        MatSelectModule,            // Selector de Angular Material
        MatOptionModule,            // Opciones de Angular Material
      ],
      providers: [
        SQLite,                     // Agrega el provider para SQLite
        ServiceBDService,
        NativeStorage          // Agrega el ServiceBDService si depende de SQLite
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModifyProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Aplica la detección de cambios inicial
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
