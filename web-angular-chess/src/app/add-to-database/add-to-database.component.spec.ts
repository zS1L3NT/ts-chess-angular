import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToDatabaseComponent } from './add-to-database.component';

describe('AddToDatabaseComponent', () => {
  let component: AddToDatabaseComponent;
  let fixture: ComponentFixture<AddToDatabaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddToDatabaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddToDatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
