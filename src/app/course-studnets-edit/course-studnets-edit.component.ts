import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Course } from 'src/models/course.model';
import { Student } from 'src/models/student.model';
import { LecturerService } from 'src/services/lecturer.service';

@Component({
  selector: 'app-course-studnets-edit',
  templateUrl: './course-studnets-edit.component.html',
  styleUrls: ['./course-studnets-edit.component.css'],
})
export class CourseStudnetsEditComponent implements OnInit, OnDestroy {
  students: Student[] = [];
  studentsSub: Subscription;

  selectedCourse: Course;
  courseSub: Subscription;

  isModalOpen: boolean = false;
  msg: string = '';

  constructor(private LecturerService: LecturerService) {}

  ngOnInit(): void {
    this.LecturerService.getStudents();
    this.studentsSub = this.LecturerService.students.subscribe(
      (students: Student[]) => {
        this.students = students;
      }
    );
    this.LecturerService.selectedCourse.subscribe((course: Course) => {
      this.selectedCourse = course;
    });
  }

  ngOnDestroy() {
    this.studentsSub.unsubscribe();
    // this.courseSub.unsubscribe();
  }

  onClickCloseModal() {
    this.isModalOpen = false;
  }

  onAsignStudent(studentId) {
    this.LecturerService.asignStudentToCourse(
      studentId,
      this.selectedCourse._id
    ).subscribe(
      () => {},
      (errorMessage) => {
        this.isModalOpen = true;
        this.msg = errorMessage;
      }
    );
  }

  onRemoveStudentCourse(studentId) {
    this.LecturerService.removeStudentFromCourse(
      studentId,
      this.selectedCourse._id
    );
  }

  isAsigned(studentId, courseId): boolean {
    let flag: boolean = false;
    this.students.forEach((student) => {
      if (studentId === student._id) {
        student.courses.forEach((course) => {
          if (course.courseId === courseId) {
            flag = true;
          }
        });
      }
    });
    return flag;
  }
}
