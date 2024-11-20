import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PanelAddPage } from './panel-add.page';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { ServiceBDService } from 'src/app/services/service-bd.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

describe('PanelAddPage', () => {
  let component: PanelAddPage;
  let fixture: ComponentFixture<PanelAddPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PanelAddPage],
      imports: [
        IonicModule.forRoot(),      
        RouterTestingModule,        
        FormsModule,                
      ],
      providers: [
        SQLite,                   
        ServiceBDService,
        NativeStorage         
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PanelAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
