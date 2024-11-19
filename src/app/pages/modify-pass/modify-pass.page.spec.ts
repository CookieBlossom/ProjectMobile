import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ModifyPassPage } from './modify-pass.page';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { ServiceBDService } from 'src/app/services/service-bd.service';
import { UserSessionService } from 'src/app/services/user-session.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Users } from 'src/app/services/users';

describe('ModifyPassPage', () => {
  let component: ModifyPassPage;
  let fixture: ComponentFixture<ModifyPassPage>;
  let serviceBD: jasmine.SpyObj<ServiceBDService>;
  let userSessionService: jasmine.SpyObj<UserSessionService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const serviceBDSpy = jasmine.createSpyObj('ServiceBDService', [
      'presentAlert',
      'editUser',
    ]);
    const userSessionServiceSpy = jasmine.createSpyObj('UserSessionService', [
      'getUserSession',
      'setUserSession',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ModifyPassPage],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        FormBuilder,
        { provide: ServiceBDService, useValue: serviceBDSpy },
        { provide: UserSessionService, useValue: userSessionServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModifyPassPage);
    component = fixture.componentInstance;

    serviceBD = TestBed.inject(ServiceBDService) as jasmine.SpyObj<ServiceBDService>;
    userSessionService = TestBed.inject(UserSessionService) as jasmine.SpyObj<UserSessionService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    const mockUser = new Users(
      '12345678-9',
      'Test User',
      'image.jpg',
      'M',
      'test@example.com',
      'OldPassword123!',
      '123456789',
      1
    );
    userSessionService.getUserSession.and.returnValue(of(mockUser));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe ser inválido el formulario si los campos están vacíos', () => {
    expect(component.modifyPassForm.valid).toBeFalsy();
  });

  it('debe ser inválido el campo currentPassword si está vacío', () => {
    let currentPassword = component.modifyPassForm.controls['currentPassword'];
    currentPassword.setValue('');
    expect(currentPassword.valid).toBeFalsy();
    expect(currentPassword.errors?.['required']).toBeTruthy();
  });

  it('debe ser inválido el campo newPassword si no cumple el patrón', () => {
    let newPassword = component.modifyPassForm.controls['newPassword'];
    newPassword.setValue('password');
    expect(newPassword.valid).toBeFalsy();
    expect(newPassword.errors?.['pattern']).toBeTruthy();
  });

  it('debe detectar que las nuevas contraseñas no coinciden', () => {
    let newPassword = component.modifyPassForm.controls['newPassword'];
    let confirmNewPassword = component.modifyPassForm.controls['confirmNewPassword'];
    newPassword.setValue('NewPassword123!');
    confirmNewPassword.setValue('DifferentPassword!');
    component.modifyPassForm.updateValueAndValidity();
    expect(component.modifyPassForm.errors?.['passwordMismatch']).toBeTruthy();
  });

  it('debe mostrar mensaje de error si la contraseña actual es incorrecta', () => {
    serviceBD.presentAlert.and.callThrough();

    component.modifyPassForm.controls['currentPassword'].setValue('WrongPassword!');
    component.modifyPassForm.controls['newPassword'].setValue('NewPassword123!');
    component.modifyPassForm.controls['confirmNewPassword'].setValue('NewPassword123!');
    component.onSubmit();

    expect(serviceBD.presentAlert).toHaveBeenCalledWith('Error', 'La contraseña actual es incorrecta');
  });

  it('debe actualizar la contraseña correctamente', fakeAsync(() => {
    serviceBD.editUser.and.returnValue(Promise.resolve());
    userSessionService.setUserSession.and.returnValue(Promise.resolve());
    serviceBD.presentAlert.and.callThrough();
    router.navigate.and.returnValue(Promise.resolve(true));

    component.modifyPassForm.controls['currentPassword'].setValue('OldPassword123!');
    component.modifyPassForm.controls['newPassword'].setValue('NewPassword123!');
    component.modifyPassForm.controls['confirmNewPassword'].setValue('NewPassword123!');
    component.onSubmit();
    tick();

    expect(serviceBD.editUser).toHaveBeenCalled();
    expect(userSessionService.setUserSession).toHaveBeenCalled();
    expect(serviceBD.presentAlert).toHaveBeenCalledWith('Éxito', 'Contraseña actualizada correctamente');
    expect(router.navigate).toHaveBeenCalledWith(['/profile']);
  }));

  it('debe mostrar mensaje de error si falla al actualizar la contraseña', fakeAsync(() => {
    serviceBD.editUser.and.returnValue(Promise.reject('Error'));
    serviceBD.presentAlert.and.callThrough();

    component.modifyPassForm.controls['currentPassword'].setValue('OldPassword123!');
    component.modifyPassForm.controls['newPassword'].setValue('NewPassword123!');
    component.modifyPassForm.controls['confirmNewPassword'].setValue('NewPassword123!');
    component.onSubmit();
    tick();

    expect(serviceBD.presentAlert).toHaveBeenCalledWith('Error', 'No se pudo actualizar la contraseña');
  }));

  it('debe navegar a la ruta especificada al llamar a irPagina', () => {
    router.navigate.and.returnValue(Promise.resolve(true));
    component.irPagina('/profile');
    expect(router.navigate).toHaveBeenCalledWith(['/profile']);
  });

  it('debe validar correctamente si las contraseñas coinciden', () => {
    let newPassword = component.modifyPassForm.controls['newPassword'];
    let confirmNewPassword = component.modifyPassForm.controls['confirmNewPassword'];
    newPassword.setValue('NewPassword123!');
    confirmNewPassword.setValue('NewPassword123!');
    component.modifyPassForm.updateValueAndValidity();
    expect(component.modifyPassForm.errors?.['passwordMismatch']).toBeUndefined();
  });
});
