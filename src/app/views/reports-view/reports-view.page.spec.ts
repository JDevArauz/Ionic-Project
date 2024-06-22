import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportsViewPage } from './reports-view.page';

describe('ReportsViewPage', () => {
  let component: ReportsViewPage;
  let fixture: ComponentFixture<ReportsViewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
