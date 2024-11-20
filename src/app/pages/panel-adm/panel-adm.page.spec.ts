import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PanelAdmPage } from './panel-adm.page';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { ServiceBDService } from 'src/app/services/service-bd.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('PanelAdmPage', () => {
  let component: PanelAdmPage;
  let fixture: ComponentFixture<PanelAdmPage>;
  let router: Router;
  let activatedRoute: ActivatedRoute;
  let serviceBDSpy: jasmine.SpyObj<ServiceBDService>;

  beforeEach(async () => {
    serviceBDSpy = jasmine.createSpyObj('ServiceBDService', [
      'dbReady',
      'fetchProducts',
      'fetchUsers',
      'fetchOrder',
      'searchProducts',
      'searchUsers',
      'searchOrders',
    ]);

    serviceBDSpy.dbReady.and.returnValue(of(true));
    serviceBDSpy.fetchProducts.and.returnValue(of([]));
    serviceBDSpy.fetchUsers.and.returnValue(of([]));
    serviceBDSpy.fetchOrder.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [PanelAdmPage],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule.withRoutes([]), 
      ],
      providers: [
        SQLite,
        { provide: ServiceBDService, useValue: serviceBDSpy },
        NativeStorage,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PanelAdmPage);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);

    spyOn(router, 'navigate');

    fixture.detectChanges(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Debe navegar a la ruta especificada', () => {
    const ruta = '/some-route';
    component.irPagina(ruta);
    expect(router.navigate).toHaveBeenCalledWith([ruta]);
  });
});
