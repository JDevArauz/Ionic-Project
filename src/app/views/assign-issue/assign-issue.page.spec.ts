import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssignIssuePage } from './assign-issue.page';

describe('AssignIssuePage', () => {
  let component: AssignIssuePage;
  let fixture: ComponentFixture<AssignIssuePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignIssuePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
