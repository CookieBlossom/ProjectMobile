import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdmProductsPage } from './adm-products.page';

describe('AdmProductsPage', () => {
  let component: AdmProductsPage;
  let fixture: ComponentFixture<AdmProductsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
