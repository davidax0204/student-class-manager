import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseStudnetsEditComponent } from './course-studnets-edit.component';

describe('CourseStudnetsEditComponent', () => {
  let component: CourseStudnetsEditComponent;
  let fixture: ComponentFixture<CourseStudnetsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseStudnetsEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseStudnetsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
