import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Course } from 'src/models/course.model';
import { LecturerService } from 'src/services/lecturer.service';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-course-edit-page',
  templateUrl: './course-edit-page.component.html',
  styleUrls: ['./course-edit-page.component.css'],
})
export class CourseEditPageComponent implements OnInit, OnDestroy {
  courseForm: FormGroup;
  timesArray: FormArray;
  courseName;
  courseStartDate;
  courseEndDate;
  weekDay: FormControl;

  courseSub: Subscription;
  activeCourse: Course;

  isModalOpen = false;
  msg;

  constructor(
    private formBuilder: FormBuilder,
    private LecturerService: LecturerService,
    private datepipe: DatePipe
  ) {
    this.courseForm = this.formBuilder.group(
      {
        courseName: ['', [Validators.required]],
        courseStartDate: ['', [Validators.required]],
        courseEndDate: ['', [Validators.required]],
        timesArray: this.formBuilder.array([]),
      },
      {
        validators: this.endDateValidator,
      }
    );

    this.courseName = this.courseForm.get('courseName');
    this.courseStartDate = this.courseForm.get('courseStartDate');
    this.courseEndDate = this.courseForm.get('courseEndDate');
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      weekDay: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.courseSub = this.LecturerService.selectedCourse.subscribe(
      (course: Course) => {
        this.activeCourse = !course ? null : course;

        if (this.activeCourse) {
          this.courseForm.controls['courseName'].setValue(
            this.activeCourse.name
          );

          this.courseForm.controls['courseStartDate'].setValue(
            this.datepipe.transform(
              new Date(this.activeCourse.startDate),
              'yyyy-MM-dd'
            )
          );

          this.courseForm.controls['courseEndDate'].setValue(
            this.datepipe.transform(
              new Date(this.activeCourse.endDate),
              'yyyy-MM-dd'
            )
          );

          for (let index = 0; index < course.times.length; index++) {
            this.timesArray = this.courseForm.get('timesArray') as FormArray;
            this.timesArray.push(this.createItem());

            this.timesArray.controls[index]
              .get('weekDay')
              .setValue(course.times[index].weekDay);
            this.timesArray.controls[index]
              .get('endTime')
              .setValue(course.times[index].endTime);
            this.timesArray.controls[index]
              .get('startTime')
              .setValue(course.times[index].startTime);
          }
        }
      }
    );
  }

  ngOnDestroy() {
    this.courseSub.unsubscribe();
  }

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

  invalidStartTimeMessage(index) {
    if (this.courseForm.controls.courseStartDate.errors?.required) {
      return 'You must enter a course start time';
    }
  }

  invalidEndTimeMessage(index) {
    if (this.courseForm.controls.courseEndDate.errors?.required) {
      return 'You must enter a course end time';
    }
  }

  invalidCourseEndDateMessage() {
    if (this.courseEndDate.errors?.required) {
      return 'You must enter an end date';
    }
    if (this.courseForm.errors?.invalidEndDate) {
      return 'You must enter a valid end date';
    }
  }

  endDateValidator(control: FormGroup): ValidationErrors | null {
    const startDate = control.get('courseStartDate').value;
    const endDate = control.get('courseEndDate').value;
    Date.parse(startDate);
    Date.parse(endDate);
    return startDate >= endDate ? { invalidEndDate: true } : null;
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

  addTime(): void {
    this.timesArray = this.courseForm.get('timesArray') as FormArray;
    this.timesArray.push(this.createItem());
  }

  removeTime(index) {
    (<FormArray>this.courseForm.get('timesArray')).removeAt(index);
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
      this.courseForm.value.timesArray
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
