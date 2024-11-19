import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrdersPage } from './orders.page';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ServiceBDService } from 'src/app/services/service-bd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

describe('OrdersPage', () => {
  let component: OrdersPage;
  let fixture: ComponentFixture<OrdersPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrdersPage],
      imports: [
        IonicModule.forRoot(),      // Inicializa Ionic
        RouterTestingModule,        // Simula el enrutamiento necesario
        FormsModule,                // Soporte para formularios template-driven
      ],
      providers: [
        SQLite,                     // Agrega el provider para SQLite
        ServiceBDService,
        NativeStorage         // Agrega el ServiceBDService si depende de SQLite
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersPage);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Aplica la detección de cambios inicial
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
