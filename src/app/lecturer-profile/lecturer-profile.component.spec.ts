import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LecturerProfileComponent } from './lecturer-profile.component';

describe('LecturerProfileComponent', () => {
  let component: LecturerProfileComponent;
  let fixture: ComponentFixture<LecturerProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LecturerProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LecturerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
