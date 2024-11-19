import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsPage } from './products.page';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { ServiceBDService } from 'src/app/services/service-bd.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations'; // Importa este módulo
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

describe('ProductsPage', () => {
  let component: ProductsPage;
  let fixture: ComponentFixture<ProductsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductsPage],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule,
        ReactiveFormsModule,
        FormsModule,
        MatSliderModule,         // Importa Material Slider
        MatFormFieldModule,      // Importa Material Form Field
        MatSelectModule,
        NoopAnimationsModule         // Importa Material Select
      ],
      providers: [
        SQLite,
        ServiceBDService,
        NativeStorage,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
