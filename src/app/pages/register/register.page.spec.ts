import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RegisterPage } from './register.page';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServiceBDService } from 'src/app/services/service-bd.service';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;
  let serviceBDService: jasmine.SpyObj<ServiceBDService>;
  let apiService: jasmine.SpyObj<ApiService>;
  let snackBar: MatSnackBar;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const serviceBDServiceSpy = jasmine.createSpyObj('ServiceBDService', [
      'findUserByEmail',
      'findUserByRut',
      'registerUser',
      'searchUsers'
    ]);
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['getImageRandom']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [RegisterPage],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        FormBuilder,
        { provide: ServiceBDService, useValue: serviceBDServiceSpy },
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;

    serviceBDService = TestBed.inject(ServiceBDService) as jasmine.SpyObj<ServiceBDService>;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    snackBar = TestBed.inject(MatSnackBar);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe ser inválido el formulario si los campos están vacíos', () => {
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('debe ser inválido el campo email si el formato es incorrecto', () => {
    let email = component.registerForm.controls['email'];
    email.setValue('usuario@incorrecto');
    expect(email.valid).toBeFalsy();
    expect(email.errors?.['email']).toBeTruthy();
  });

  it('debe ser inválido el campo rut si el formato es incorrecto', () => {
    let rut = component.registerForm.controls['rut'];
    rut.setValue('12345678');
    expect(rut.valid).toBeFalsy();
    expect(rut.errors?.['invalidRut']).toBeTruthy();
  });

  it('debe detectar que las contraseñas no coinciden', () => {
    let password = component.registerForm.controls['password'];
    let confirmPassword = component.registerForm.controls['confirmPassword'];
    password.setValue('Password123!');
    confirmPassword.setValue('DifferentPassword!');
    component.registerForm.updateValueAndValidity();
    expect(component.registerForm.errors?.['mismatch']).toBeTruthy();
  });

  it('debe llamar a findUserByEmail durante el registro', fakeAsync(() => {
    serviceBDService.findUserByEmail.and.returnValue(Promise.resolve(false));
    serviceBDService.findUserByRut.and.returnValue(Promise.resolve(false));
    apiService.getImageRandom.and.returnValue(of([{ url: 'http://example.com/image.jpg' }]));
    serviceBDService.registerUser.and.returnValue(Promise.resolve());

    component.registerForm.controls['email'].setValue('test@gmail.com');
    component.registerForm.controls['rut'].setValue('12345678-9');
    component.registerForm.controls['password'].setValue('Password123!');
    component.registerForm.controls['confirmPassword'].setValue('Password123!');

    component.onSubmit();
    tick();

    expect(serviceBDService.findUserByEmail).toHaveBeenCalledWith('test@gmail.com');
  }));

  it('debe mostrar mensaje si el email ya está registrado', fakeAsync(() => {
    serviceBDService.findUserByEmail.and.returnValue(Promise.resolve(true));
    snackBar.open.and.callThrough();

    component.registerForm.controls['email'].setValue('existing@gmail.com');
    component.registerForm.controls['rut'].setValue('12345678-9');
    component.registerForm.controls['password'].setValue('Password123!');
    component.registerForm.controls['confirmPassword'].setValue('Password123!');

    component.onSubmit();
    tick();

    expect(snackBar.open).toHaveBeenCalledWith(
      'El correo electrónico ya está registrado.',
      'Cerrar',
      { duration: 3000, horizontalPosition: 'center', verticalPosition: 'bottom' }
    );
  }));

  it('debe mostrar mensaje si el RUT ya está registrado', fakeAsync(() => {
    serviceBDService.findUserByEmail.and.returnValue(Promise.resolve(false));
    serviceBDService.findUserByRut.and.returnValue(Promise.resolve(true));
    snackBar.open.and.callThrough();

    component.registerForm.controls['email'].setValue('test@gmail.com');
    component.registerForm.controls['rut'].setValue('existing-rut');
    component.registerForm.controls['password'].setValue('Password123!');
    component.registerForm.controls['confirmPassword'].setValue('Password123!');

    component.onSubmit();
    tick();

    expect(snackBar.open).toHaveBeenCalledWith(
      'El RUT ya está registrado.',
      'Cerrar',
      { duration: 3000, horizontalPosition: 'center', verticalPosition: 'bottom' }
    );
  }));

  it('debe mostrar mensaje de error si falla el registro', fakeAsync(() => {
    serviceBDService.findUserByEmail.and.returnValue(Promise.resolve(false));
    serviceBDService.findUserByRut.and.returnValue(Promise.resolve(false));
    apiService.getImageRandom.and.returnValue(of([{ url: 'http://example.com/image.jpg' }]));
    serviceBDService.registerUser.and.returnValue(Promise.reject('Error'));
    snackBar.open.and.callThrough();

    component.registerForm.controls['email'].setValue('test@gmail.com');
    component.registerForm.controls['rut'].setValue('12345678-9');
    component.registerForm.controls['password'].setValue('Password123!');
    component.registerForm.controls['confirmPassword'].setValue('Password123!');

    component.onSubmit();
    tick();

    expect(snackBar.open).toHaveBeenCalledWith(
      'Error durante el registro. Intente nuevamente.',
      'Cerrar',
      { duration: 3000, horizontalPosition: 'center', verticalPosition: 'bottom' }
    );
  }));
});
