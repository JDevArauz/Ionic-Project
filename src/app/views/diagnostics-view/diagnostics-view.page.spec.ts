import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiagnosticsViewPage } from './diagnostics-view.page';

describe('DiagnosticsViewPage', () => {
  let component: DiagnosticsViewPage;
  let fixture: ComponentFixture<DiagnosticsViewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagnosticsViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
