import { ComponentFixture, TestBed, fakeAsync, tick, flushMicrotasks } from '@angular/core/testing';
import { ProfilePage } from './profile.page';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { ServiceBDService } from 'src/app/services/service-bd.service';
import { UserSessionService } from 'src/app/services/user-session.service';
import { of } from 'rxjs';
import { Users } from 'src/app/services/users';

describe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;
  let router: Router;
  let activatedRoute: ActivatedRoute;
  let alertController: AlertController;
  let serviceBDService: ServiceBDService;
  let userSessionService: UserSessionService;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'getCurrentNavigation']);
    const activatedRouteSpy = { queryParams: of({}) };
    const alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);
    const serviceBDServiceSpy = jasmine.createSpyObj('ServiceBDService', ['dbReady', 'fetchProducts', 'editUser', 'presentAlert']);
    const userSessionServiceSpy = jasmine.createSpyObj('UserSessionService', ['getUserSession', 'setUserSession', 'deleteUserSession']);

    await TestBed.configureTestingModule({
      declarations: [ProfilePage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: AlertController, useValue: alertControllerSpy },
        { provide: ServiceBDService, useValue: serviceBDServiceSpy },
        { provide: UserSessionService, useValue: userSessionServiceSpy },
        NativeStorage,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    alertController = TestBed.inject(AlertController);
    serviceBDService = TestBed.inject(ServiceBDService);
    userSessionService = TestBed.inject(UserSessionService);

    serviceBDService.dbReady.and.returnValue(of(true));
    serviceBDService.fetchProducts.and.returnValue(of([]));
    userSessionService.getUserSession.and.returnValue(of(new Users('12345678-9', 'Test User', 'image.jpg', 'M', 'test@example.com', 'password', '123456789', 1)));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe obtener la sesión del usuario en ngOnInit', () => {
    expect(userSessionService.getUserSession).toHaveBeenCalled();
    expect(component.user?.name).toEqual('Test User');
  });

  it('debe navegar a la ruta especificada al llamar a irPagina', () => {
    router.navigate = jasmine.createSpy().and.returnValue(Promise.resolve(true));
    component.irPagina('/test-route');
    expect(router.navigate).toHaveBeenCalledWith(['/test-route']);
  });

  it('debe mostrar una alerta de confirmación al llamar a confirmarCierre', fakeAsync(() => {
    const alertSpy = jasmine.createSpyObj('HTMLIonAlertElement', ['present']);
    alertController.create.and.returnValue(Promise.resolve(alertSpy));

    component.confirmarCierre();
    tick();

    expect(alertController.create).toHaveBeenCalledWith({
      header: 'Confirmar cierre de sesión',
      message: `¿Estás seguro?`,
      cssClass: 'alert',
      buttons: [
        { text: 'Sí', role: 'cancel', handler: jasmine.any(Function) },
        { text: 'No', handler: jasmine.any(Function) }
      ]
    });
    expect(alertSpy.present).toHaveBeenCalled();
  }));

  it('debe borrar la sesión y navegar a /login al llamar a logout', fakeAsync(() => {
    userSessionService.deleteUserSession.and.returnValue(Promise.resolve());
    router.navigate.and.returnValue(Promise.resolve(true));

    component.logout();
    tick();

    expect(userSessionService.deleteUserSession).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('debe mostrar la imagen del usuario si imageUser está definida', () => {
    component.imageUser = 'path/to/image.jpg';
    fixture.detectChanges();
    const imgElement = fixture.nativeElement.querySelector('.image-profile');
    expect(imgElement).toBeTruthy();
    expect(imgElement.src).toContain('path/to/image.jpg');
  });
});
