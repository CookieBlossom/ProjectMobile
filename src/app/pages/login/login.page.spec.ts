import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ServiceBDService } from 'src/app/services/service-bd.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { UserSessionService } from 'src/app/services/user-session.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let serviceBDSpy: jasmine.SpyObj<ServiceBDService>;

  beforeEach(async () => {
    serviceBDSpy = jasmine.createSpyObj('ServiceBDService', [
      'searchUsers',
      'loginUser',
      'presentAlert',
      'dbReady',
    ]);

    serviceBDSpy.dbReady.and.returnValue(of(true));

    await TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [
        IonicModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: ServiceBDService, useValue: serviceBDSpy },
        NativeStorage,
        UserSessionService,
        Router,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('validar correctamente el correo del usuario', () => {
    const control = component.loginForm.get('email');
    control?.setValue('usuario@example.com');
    expect(control?.valid).toBeTrue();
  });
});
