import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TabsComponent } from './tabs.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { ApiService } from 'src/app/services/api.service';
import { ServiceBDService } from 'src/app/services/service-bd.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('TabsComponent', () => {
  let component: TabsComponent;
  let fixture: ComponentFixture<TabsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TabsComponent],
      imports: [
        IonicModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule, // Configura enrutamiento simulado
        HttpClientModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => 'test-id', // Simula parámetros de ruta
              },
            },
            params: of({ id: 'test-id' }), // Simula parámetros observables
          },
        },
        SQLite, // Agrega SQLite si se utiliza
        ServiceBDService, // Agrega el servicio de BD si depende de SQLite
        NativeStorage, // Agrega NativeStorage si es necesario
        ApiService, // Proveedor del ApiService
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
