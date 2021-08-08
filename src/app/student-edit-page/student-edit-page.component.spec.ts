import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentEditPageComponent } from './student-edit-page.component';

describe('StudentEditPageComponent', () => {
  let component: StudentEditPageComponent;
  let fixture: ComponentFixture<StudentEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentEditPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
