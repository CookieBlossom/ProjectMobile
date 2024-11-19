import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModifyPassPage } from './modify-pass.page';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

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
    }).compileComponents();

    fixture = TestBed.createComponent(ModifyPassPage);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Aplica la detección de cambios inicial
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
