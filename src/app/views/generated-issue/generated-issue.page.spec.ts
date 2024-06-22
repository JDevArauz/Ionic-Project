import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GeneratedIssuePage } from './generated-issue.page';

describe('GeneratedIssuePage', () => {
  let component: GeneratedIssuePage;
  let fixture: ComponentFixture<GeneratedIssuePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratedIssuePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
