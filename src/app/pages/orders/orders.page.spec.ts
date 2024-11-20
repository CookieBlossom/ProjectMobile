import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrdersPage } from './orders.page';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ServiceBDService } from 'src/app/services/service-bd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { UserSessionService } from 'src/app/services/user-session.service';
import { of } from 'rxjs';

describe('OrdersPage', () => {
  let component: OrdersPage;
  let fixture: ComponentFixture<OrdersPage>;
  let serviceBDSpy: jasmine.SpyObj<ServiceBDService>;
  let userSessionSpy: jasmine.SpyObj<UserSessionService>;

  beforeEach(async () => {
    serviceBDSpy = jasmine.createSpyObj('ServiceBDService', [
      'dbReady',
      'searchProducts',
      'fetchProducts',
      'getOrdersByRut',
      'getOrderHistoryByRut',
    ]);
    userSessionSpy = jasmine.createSpyObj('UserSessionService', [
      'getUserSession',
    ]);

    serviceBDSpy.dbReady.and.returnValue(of(true));
    serviceBDSpy.searchProducts.and.stub();
    serviceBDSpy.fetchProducts.and.returnValue(of([]));
    serviceBDSpy.getOrdersByRut.and.returnValue(Promise.resolve([]));
    serviceBDSpy.getOrderHistoryByRut.and.returnValue(Promise.resolve([]));
    userSessionSpy.getUserSession.and.returnValue(
      of({
        rut: '12345678-9',
        email: 'test@example.com',
        name: 'Test User',
        imageuser: '',
        genderuser: 'M',
        password: 'Password123!',
        phone: 123456789,
        idrol: 2,
      })
    );

    await TestBed.configureTestingModule({
      declarations: [OrdersPage],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule,
        FormsModule,
      ],
      providers: [
        { provide: SQLite, useValue: {} },
        { provide: ServiceBDService, useValue: serviceBDSpy },
        { provide: NativeStorage, useValue: {} },
        { provide: UserSessionService, useValue: userSessionSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersPage);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Debe llamar a las ordenes para que las traiga cuando un usuario este activo', () => {
    const traerOrdenesSpy = spyOn(component, 'traerOrdenes'); 
    component.verificarConexionBD();

    expect(traerOrdenesSpy).toHaveBeenCalledWith('12345678-9');
  });
});
