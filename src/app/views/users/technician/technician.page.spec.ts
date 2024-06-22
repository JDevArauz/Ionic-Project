import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TechnicianPage } from './technician.page';

describe('TechnicianPage', () => {
  let component: TechnicianPage;
  let fixture: ComponentFixture<TechnicianPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicianPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
