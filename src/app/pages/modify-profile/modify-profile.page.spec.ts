import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModifyProfilePage } from './modify-profile.page';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { ServiceBDService } from 'src/app/services/service-bd.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

describe('ModifyProfilePage', () => {
  let component: ModifyProfilePage;
  let fixture: ComponentFixture<ModifyProfilePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifyProfilePage],
      imports: [
        IonicModule.forRoot(),    
        RouterTestingModule,        
        FormsModule,                
        ReactiveFormsModule,        
        MatFormFieldModule,         
        MatInputModule,             
        MatButtonModule,            
        MatCardModule,           
        MatSnackBarModule,         
        MatSelectModule,            
        MatOptionModule,            
      ],
      providers: [
        SQLite,                    
        ServiceBDService,
        NativeStorage         
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModifyProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
