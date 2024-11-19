import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { ServiceBDService } from 'src/app/services/service-bd.service';
import { UserSessionService } from 'src/app/services/user-session.service';
import { of } from 'rxjs';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let routerSpy: jasmine.SpyObj<Router>;
  let serviceBDSpy: jasmine.SpyObj<ServiceBDService>;
  let userSessionServiceSpy: jasmine.SpyObj<UserSessionService>;
  let nativeStorageSpy: jasmine.SpyObj<NativeStorage>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    serviceBDSpy = jasmine.createSpyObj('ServiceBDService', [
      'searchUsers',
      'loginUser',
      'presentAlert',
      'dbReady',
    ]);
    userSessionServiceSpy = jasmine.createSpyObj('UserSessionService', [
      'setUserSession',
      'getUserSession',
    ]);
    nativeStorageSpy = jasmine.createSpyObj('NativeStorage', ['setItem']);

    await TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [IonicModule.forRoot(), ReactiveFormsModule, FormsModule],
      providers: [
        FormBuilder,
        { provide: Router, useValue: routerSpy },
        { provide: ServiceBDService, useValue: serviceBDSpy },
        { provide: UserSessionService, useValue: userSessionServiceSpy },
        { provide: NativeStorage, useValue: nativeStorageSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería navegar a la página de registro', () => {
    component.irPagina('/register');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/register']);
  });

  it('debería mostrar un error de inicio de sesión si el usuario no es encontrado', fakeAsync(() => {
    serviceBDSpy.loginUser.and.returnValue(Promise.resolve(null));
    serviceBDSpy.presentAlert.and.stub();

    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('InvalidPassword1!');
    component.login();

    tick();
    expect(serviceBDSpy.presentAlert).toHaveBeenCalledWith(
      'Error de login',
      'Usuario no encontrado o contraseña incorrecta.'
    );
  }));

  it('debería establecer la sesión del usuario en un inicio de sesión exitoso', fakeAsync(() => {
    const mockUser = { rut: '12345678-9', email: 'test@example.com' };
    serviceBDSpy.loginUser.and.returnValue(Promise.resolve(mockUser));
    userSessionServiceSpy.setUserSession.and.returnValue(Promise.resolve());

    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('ValidPassword1!');
    component.login();

    tick();
    expect(userSessionServiceSpy.setUserSession).toHaveBeenCalledWith(mockUser);
  }));
});
