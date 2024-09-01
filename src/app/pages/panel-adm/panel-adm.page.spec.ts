import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PanelAdmPage } from './panel-adm.page';

describe('PanelAdmPage', () => {
  let component: PanelAdmPage;
  let fixture: ComponentFixture<PanelAdmPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelAdmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
