import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PanelAdmPage } from './panel-adm.page';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { ServiceBDService } from 'src/app/services/service-bd.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Productos } from 'src/app/services/productos';
import { Users } from 'src/app/services/users';
import { Order } from 'src/app/services/order';

describe('PanelAdmPage', () => {
  let component: PanelAdmPage;
  let fixture: ComponentFixture<PanelAdmPage>;
  let router: Router;
  let serviceBD: ServiceBDService;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const serviceBDSpy = jasmine.createSpyObj('ServiceBDService', [
      'dbReady',
      'fetchProducts',
      'fetchUsers',
      'fetchOrder',
      'searchProducts',
      'searchUsers',
      'searchOrders'
    ]);

    const activatedRouteSpy = {
      snapshot: {
        paramMap: {
          get: () => {}
        }
      }
    };

    await TestBed.configureTestingModule({
      declarations: [PanelAdmPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ServiceBDService, useValue: serviceBDSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PanelAdmPage);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    serviceBD = TestBed.inject(ServiceBDService);
    activatedRoute = TestBed.inject(ActivatedRoute);

    serviceBD.dbReady.and.returnValue(of(true));

    serviceBD.fetchProducts.and.returnValue(of([]));
    serviceBD.fetchUsers.and.returnValue(of([]));
    serviceBD.fetchOrder.and.returnValue(of([]));

    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe llamar a verificarConexionBD en ngOnInit', () => {
    spyOn(component, 'verificarConexionBD');
    component.ngOnInit();
    expect(component.verificarConexionBD).toHaveBeenCalled();
  });

  it('debe navegar a la ruta especificada al llamar a irPagina', () => {
    router.navigate.and.returnValue(Promise.resolve(true));
    component.irPagina('/adm-products');
    expect(router.navigate).toHaveBeenCalledWith(['/adm-products']);
  });

  it('debe mostrar el título "Bienvenido"', () => {
    const titleElement = fixture.nativeElement.querySelector('.title');
    expect(titleElement.textContent.trim()).toEqual('Bienvenido');
  });

  it('debe mostrar las marcas', () => {
    const brandElements = fixture.nativeElement.querySelectorAll('.brand');
    expect(brandElements.length).toEqual(2);
  });
});
