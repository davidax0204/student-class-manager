import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-course-register',
  templateUrl: './course-register.component.html',
  styleUrls: ['./course-register.component.css'],
})
export class CourseRegisterComponent implements OnInit {
  courseForm: FormGroup;
  courseName;
  courseStartDate;
  courseEndDate;

  isModalOpen = false;
  msg;

  daysData: Array<any> = [
    { name: 'Sunday', value: 'sunday' },
    { name: 'Monday', value: 'monday' },
    { name: 'Tuesday', value: 'tuesday' },
    { name: 'Wednesday', value: 'wednesday' },
    { name: 'Thursday ', value: 'thursday ' },
    { name: 'Friday', value: 'friday' },
  ];

  constructor(private formBuilder: FormBuilder) {
    this.courseForm = this.formBuilder.group({
      courseName: ['', [Validators.required]],
      courseStartDate: ['', [Validators.required]],
      courseEndDate: ['', [Validators.required]],
      daysData: this.formBuilder.array([]),
    });

    this.courseName = this.courseForm.get('courseName');
    this.courseStartDate = this.courseForm.get('courseStartDate');
    this.courseEndDate = this.courseForm.get('courseEndDate');
  }

  ngOnInit(): void {}

  invalidCourseNameMessage() {
    if (this.courseName.errors?.required) {
      return 'You must enter a course name';
    }
  }

  invalidCourseStartDateMessage() {
    if (this.courseStartDate.errors?.required) {
      return 'You must enter a start date';
    }
  }

  invalidCourseEndDateMessage() {
    if (this.courseStartDate.errors?.required) {
      return 'You must enter a start date';
    }
  }

  onClickCloseModal() {
    this.isModalOpen = false;
  }

  onCheckboxChange(e) {
    const checkArray: FormArray = this.courseForm.get('daysData') as FormArray;

    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  onSubmitProfileEditForm() {
    console.log(this.daysData);
  }
}
