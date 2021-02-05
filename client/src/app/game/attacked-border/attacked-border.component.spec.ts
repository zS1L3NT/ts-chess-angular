import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttackedBorderComponent } from './attacked-border.component';

describe('AttackedBorderComponent', () => {
  let component: AttackedBorderComponent;
  let fixture: ComponentFixture<AttackedBorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttackedBorderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttackedBorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
