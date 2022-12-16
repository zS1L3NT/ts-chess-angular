import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectBorderComponent } from './select-border.component';

describe('SelectBorderComponent', () => {
  let component: SelectBorderComponent;
  let fixture: ComponentFixture<SelectBorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectBorderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectBorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
