import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModifyPassPage } from './modify-pass.page';

describe('ModifyPassPage', () => {
  let component: ModifyPassPage;
  let fixture: ComponentFixture<ModifyPassPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyPassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
