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
import { eachDayOfInterval, getDay } from 'date-fns';
import { Course } from 'src/models/course.model';
import { LecturerService } from 'src/services/lecturer.service';

@Component({
  selector: 'app-course-register',
  templateUrl: './course-register.component.html',
  styleUrls: ['./course-register.component.css'],
})
export class CourseRegisterComponent implements OnInit {
  courseForm: FormGroup;
  timesArray: FormArray;
  courseName;
  courseStartDate;
  courseEndDate;

  weekDay: FormControl;

  isModalOpen = false;
  msg;

  // daysData: Array<any> = [
  //   { name: 'Sunday', value: 'sunday' },
  //   { name: 'Monday', value: 'monday' },
  //   { name: 'Tuesday', value: 'tuesday' },
  //   { name: 'Wednesday', value: 'wednesday' },
  //   { name: 'Thursday ', value: 'thursday ' },
  //   { name: 'Friday', value: 'friday' },
  // ];

  constructor(
    private formBuilder: FormBuilder,
    private LecturerService: LecturerService
  ) {
    this.courseForm = this.formBuilder.group({
      courseName: ['test', [Validators.required]],
      courseStartDate: ['2021-08-14', [Validators.required]],
      courseEndDate: ['2021-08-25', [Validators.required]],
      // daysData: this.formBuilder.array([]),
      timesArray: this.formBuilder.array([this.createItem()]),
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

  // onCheckboxChange(e) {
  //   const checkArray: FormArray = this.courseForm.get('daysData') as FormArray;

  //   if (e.target.checked) {
  //     checkArray.push(new FormControl(e.target.value));
  //   } else {
  //     let i: number = 0;
  //     checkArray.controls.forEach((item: FormControl) => {
  //       if (item.value == e.target.value) {
  //         checkArray.removeAt(i);
  //         return;
  //       }
  //       i++;
  //     });
  //   }
  // }

  createItem(): FormGroup {
    return this.formBuilder.group({
      weekDay: '',
      startTime: '',
      endTime: '',
    });
  }

  addItem(): void {
    this.timesArray = this.courseForm.get('timesArray') as FormArray;
    this.timesArray.push(this.createItem());
  }

  onSubmitProfileEditForm() {
    // let startDate = new Date(this.courseStartDate.value);
    // let endDate = new Date(this.courseEndDate.value);
    // let datesArray: Date[] = eachDayOfInterval({
    //   start: startDate,
    //   end: endDate,
    // }).filter((weekDay) => getDay(weekDay) == 0);
    // console.log(datesArray);

    this.timesArray = this.courseForm.get('timesArray') as FormArray;

    // let time = new Date(this.timesArray.value[0].startTime);
    // console.log(Date.parse(this.timesArray.value[0].startTime));

    // console.log(this.timesArray.value[0].startTime);

    let course: Course = new Course(
      this.courseName.value,
      this.courseStartDate.value,
      this.courseEndDate.value,
      this.timesArray.value
    );

    this.LecturerService.registerCourse(course).subscribe(
      () => {
        this.isModalOpen = true;
        this.msg = 'The course has registered Successfully!';
      },
      (errorMessage) => {
        this.isModalOpen = true;
        this.msg = errorMessage;
      }
    );
  }
}
