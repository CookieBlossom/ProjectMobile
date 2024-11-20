import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterPage } from './register.page';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { ServiceBDService } from 'src/app/services/service-bd.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from 'src/app/services/api.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of } from 'rxjs';

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;
  let serviceBDSpy: jasmine.SpyObj<ServiceBDService>;

  beforeEach(async () => {
    
    serviceBDSpy = jasmine.createSpyObj('ServiceBDService', [
      'dbReady',
      'searchUsers',
      'findUserByEmail',
    ]);

    serviceBDSpy.dbReady.and.returnValue(of(true));
    serviceBDSpy.findUserByEmail.and.returnValue(Promise.resolve(false));
    serviceBDSpy.searchUsers.and.stub();

    await TestBed.configureTestingModule({
      declarations: [RegisterPage],
      imports: [
        IonicModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule, 
      ],
      providers: [
        { provide: SQLite, useValue: {} },
        { provide: ServiceBDService, useValue: serviceBDSpy },
        { provide: NativeStorage, useValue: {} },
        { provide: ApiService, useValue: {} },
        FormBuilder, 
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería marcar el formulario como inválido si las contraseñas no coinciden', () => {
    component.registerForm.controls['password'].setValue('Password123!');
    component.registerForm.controls['confirmPassword'].setValue(
      'DifferentPassword123!'
    );
    expect(component.registerForm.valid).toBeFalse();
    expect(component.registerForm.errors?.['mismatch']).toBeTrue();
  });
});
