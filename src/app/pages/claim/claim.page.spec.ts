import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClaimPage } from './claim.page';

describe('ClaimPage', () => {
  let component: ClaimPage;
  let fixture: ComponentFixture<ClaimPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
