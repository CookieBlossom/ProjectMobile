import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModifyPassPage } from './modify-pass.page';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { ServiceBDService } from 'src/app/services/service-bd.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

describe('ModifyPassPage', () => {
  let component: ModifyPassPage;
  let fixture: ComponentFixture<ModifyPassPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifyPassPage],
      imports: [
        IonicModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      providers: [
        SQLite,                     
        ServiceBDService,
        NativeStorage         
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModifyPassPage);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
