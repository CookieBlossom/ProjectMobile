import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PanelAdmPage } from './panel-adm.page';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';

describe('PanelAdmPage', () => {
  let component: PanelAdmPage;
  let fixture: ComponentFixture<PanelAdmPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PanelAdmPage],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PanelAdmPage);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Aplica la detección de cambios inicial
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
