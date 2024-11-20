import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { ServiceBDService } from 'src/app/services/service-bd.service';
import { AdmModifyPage } from '../pages/adm-modify/adm-modify.page';

describe('AdmModifyPage', () => {
  let component: AdmModifyPage;
  let fixture: ComponentFixture<AdmModifyPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdmModifyPage],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
      ],
      providers: [
        NativeStorage,
        SQLite,
        ServiceBDService
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdmModifyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
});
