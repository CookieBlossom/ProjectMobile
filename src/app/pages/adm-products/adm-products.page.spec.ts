import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdmProductsPage } from './adm-products.page';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { ServiceBDService } from 'src/app/services/service-bd.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

describe('AdmProductsPage', () => {
  let component: AdmProductsPage;
  let fixture: ComponentFixture<AdmProductsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdmProductsPage],
      imports: [
        IonicModule.forRoot(), 
        RouterTestingModule,   
        FormsModule,           
      ],
      providers: [
        SQLite,                     
        ServiceBDService,
        AlertController,
        NativeStorage        
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdmProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
