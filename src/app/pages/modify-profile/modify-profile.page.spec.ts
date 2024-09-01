import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModifyProfilePage } from './modify-profile.page';

describe('ModifyProfilePage', () => {
  let component: ModifyProfilePage;
  let fixture: ComponentFixture<ModifyProfilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
