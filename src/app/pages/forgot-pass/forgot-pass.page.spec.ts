import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPassPage } from './forgot-pass.page';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { ServiceBDService } from 'src/app/services/service-bd.service';
import { NativeDateAdapter } from '@angular/material/core';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

describe('ForgotPassPage', () => {
  let component: ForgotPassPage;
  let fixture: ComponentFixture<ForgotPassPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForgotPassPage],
      imports: [
        IonicModule.forRoot(),      
        RouterTestingModule,        
        ReactiveFormsModule,        
        FormsModule,                
      ],
      providers: [
        SQLite,                     
        ServiceBDService,
        NativeDateAdapter,
        NativeStorage      
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPassPage);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
