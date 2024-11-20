import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilePage } from './profile.page';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { ServiceBDService } from 'src/app/services/service-bd.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { UserSessionService } from 'src/app/services/user-session.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;
  let serviceBDSpy: jasmine.SpyObj<ServiceBDService>;
  let userSessionSpy: jasmine.SpyObj<UserSessionService>;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    serviceBDSpy = jasmine.createSpyObj('ServiceBDService', [
      'dbReady',
      'fetchProducts',
      'editUser',
      'presentAlert',
    ]);
    userSessionSpy = jasmine.createSpyObj('UserSessionService', [
      'getUserSession',
      'setUserSession',
      'deleteUserSession',
    ]);

    serviceBDSpy.dbReady.and.returnValue(of(true));
    serviceBDSpy.fetchProducts.and.returnValue(of([]));
    userSessionSpy.getUserSession.and.returnValue(
      of({
        rut: '12345678-9',
        name: 'John Doe',
        imageuser: 'https://example.com/image.jpg',
        genderuser: 'M',
        email: 'johndoe@example.com',
        password: 'password123',
        phone: 123456789,
        idrol: 2,
      })
    );

    await TestBed.configureTestingModule({
      declarations: [ProfilePage],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        { provide: ServiceBDService, useValue: serviceBDSpy },
        { provide: UserSessionService, useValue: userSessionSpy },
        NativeStorage,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);

    spyOn(router, 'navigate');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Debe navegar a la ruta especificada al llamar a irPagina', () => {
    const ruta = '/modify-profile';
    component.irPagina(ruta);
    expect(router.navigate).toHaveBeenCalledWith([ruta]);
  });

  it('Debe recuperar la sesion de usuario', () => {
    component.obtenerSesionUsuario();
    expect(component.user).toEqual({
      rut: '12345678-9',
      name: 'John Doe',
      imageuser: 'https://example.com/image.jpg',
      genderuser: 'M',
      email: 'johndoe@example.com',
      password: 'password123',
      phone: 123456789,
      idrol: 2,
    });
  });
});
