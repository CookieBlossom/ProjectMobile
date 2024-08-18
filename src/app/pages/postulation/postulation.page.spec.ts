import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostulationPage } from './postulation.page';

describe('PostulationPage', () => {
  let component: PostulationPage;
  let fixture: ComponentFixture<PostulationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PostulationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
