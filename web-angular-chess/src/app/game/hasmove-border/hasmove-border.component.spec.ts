import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HasmoveBorderComponent } from './hasmove-border.component';

describe('HasmoveBorderComponent', () => {
  let component: HasmoveBorderComponent;
  let fixture: ComponentFixture<HasmoveBorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HasmoveBorderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HasmoveBorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
