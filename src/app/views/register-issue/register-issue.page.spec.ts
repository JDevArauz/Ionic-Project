import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterIssuePage } from './register-issue.page';

describe('RegisterIssuePage', () => {
  let component: RegisterIssuePage;
  let fixture: ComponentFixture<RegisterIssuePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterIssuePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
