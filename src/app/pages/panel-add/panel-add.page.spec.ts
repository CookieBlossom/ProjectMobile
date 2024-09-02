import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PanelAddPage } from './panel-add.page';

describe('PanelAddPage', () => {
  let component: PanelAddPage;
  let fixture: ComponentFixture<PanelAddPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
