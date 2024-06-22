import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiagnosticIssuePage } from './diagnostic-issue.page';

describe('DiagnosticIssuePage', () => {
  let component: DiagnosticIssuePage;
  let fixture: ComponentFixture<DiagnosticIssuePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagnosticIssuePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
