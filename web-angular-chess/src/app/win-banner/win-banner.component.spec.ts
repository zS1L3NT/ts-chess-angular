import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WinBannerComponent } from './win-banner.component';

describe('WinBannerComponent', () => {
  let component: WinBannerComponent;
  let fixture: ComponentFixture<WinBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WinBannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WinBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
