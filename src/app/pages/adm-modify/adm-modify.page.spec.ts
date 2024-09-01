import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdmModifyPage } from './adm-modify.page';

describe('AdmModifyPage', () => {
  let component: AdmModifyPage;
  let fixture: ComponentFixture<AdmModifyPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmModifyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
