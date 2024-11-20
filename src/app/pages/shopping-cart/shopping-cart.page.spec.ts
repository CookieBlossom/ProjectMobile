import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShoppingCartPage } from './shopping-cart.page';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { ServiceBDService } from 'src/app/services/service-bd.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

describe('ShoppingCartPage', () => {
  let component: ShoppingCartPage;
  let fixture: ComponentFixture<ShoppingCartPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShoppingCartPage],
      imports: [
        IonicModule.forRoot(),      
        RouterTestingModule,        
      ],
      providers: [
        SQLite,                     
        ServiceBDService,
        NativeStorage     
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShoppingCartPage);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
