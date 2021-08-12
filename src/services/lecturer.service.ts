import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, pipe, VirtualTimeScheduler } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { Course } from 'src/models/course.model';
import { Lecturer } from 'src/models/lecturer.model';
import { Student } from 'src/models/student.model';
import { LecturerAuthService } from './lecturer-auth.service';
const mongooseDB = environment.NODEJS_SERVER;

@Injectable({
  providedIn: 'root',
})
export class LecturerService {
  students = new BehaviorSubject<Student[]>(null);
  selectedStudent = new BehaviorSubject<Student>(null);

  courses = new BehaviorSubject<Course[]>(null);
  selectedCourse = new BehaviorSubject<Course>(null);

  constructor(
    private http: HttpClient,
    private LecturerAuthService: LecturerAuthService,
    public datepipe: DatePipe
  ) {}

  editProfile(
    firstName: string,
    lastName: string,
    phoneNumber: string,
    gender: string,
    password?: string
  ) {
    return this.http
      .post<{ lecturer: Lecturer; token: string }>(
        `${mongooseDB}/lecturer-profile/edit`,
        {
          firstName,
          lastName,
          phoneNumber,
          gender,
          password,
        }
      )
      .pipe(
        catchError(this.LecturerAuthService.handleError),
        map((resData) => {
          this.LecturerAuthService.handleAuthentication(
            resData.lecturer.firstName,
            resData.lecturer.lastName,
            resData.lecturer.email,
            resData.lecturer.phoneNumber,
            resData.lecturer.gender,
            resData.lecturer._id,
            resData.token
          );
        })
      );
  }

  getStudents() {
    this.http
      .get<Student[]>(`${mongooseDB}/students`)
      .pipe(
        map((students) => {
          this.students.next(students);
        })
      )
      .subscribe();
  }

  getCourses() {
    this.http
      .get(`${mongooseDB}/courses`)
      .pipe(
        map((courses: Course[]) => {
          this.courses.next(courses);
        })
      )
      .subscribe();
  }

  getStudent(studentId: string) {
    this.http
      .get<Student>(`${mongooseDB}/students/${studentId}`)
      .pipe(
        map((student) => {
          this.selectedStudent.next(student);
          localStorage.setItem('editedStudentId', student._id);
        })
      )
      .subscribe();
  }

  getCourse(courseId: string) {
    this.http
      .get<Course>(`${mongooseDB}/course/${courseId}`)
      .pipe(
        map((course) => {
          this.selectedCourse.next(course);
          localStorage.setItem('editedCourseId', course._id);
        })
      )
      .subscribe();
  }

  autoGetStudent() {
    const editedStudentId = localStorage.getItem('editedStudentId');
    if (editedStudentId) {
      this.getStudent(editedStudentId);
    }
  }

  autoGetCourse() {
    const editedCourseId = localStorage.getItem('editedCourseId');
    if (editedCourseId) {
      this.getCourse(editedCourseId);
    }
  }

  editStudentProfile(
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    gender: string,
    studentId: string,
    password?: string
  ) {
    return this.http
      .post<Student>(`${mongooseDB}/students/${studentId}/edit`, {
        firstName,
        lastName,
        email,
        phoneNumber,
        gender,
        password,
      })
      .pipe(
        catchError(this.LecturerAuthService.handleError),
        map((updatedStudent) => {
          this.selectedStudent.next(updatedStudent);
        })
      );
  }

  editCourseDetails(
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    gender: string,
    studentId: string,
    password?: string
  ) {
    return this.http
      .post<Student>(`${mongooseDB}/students/${studentId}/edit`, {
        firstName,
        lastName,
        email,
        phoneNumber,
        gender,
        password,
      })
      .pipe(
        catchError(this.LecturerAuthService.handleError),
        map((updatedStudent) => {
          this.selectedStudent.next(updatedStudent);
        })
      );
  }

  deleteStudent(studentId: string) {
    this.http
      .get<Student[]>(`${mongooseDB}/students/${studentId}/delete`)
      .pipe(
        map((students) => {
          this.students.next(students);
        })
      )
      .subscribe();
  }

  deleteCourse(courseId: string) {
    this.http
      .get<Course[]>(`${mongooseDB}/courses/${courseId}/delete`)
      .pipe(
        map((courses) => {
          this.courses.next(courses);
        })
      )
      .subscribe();
  }

  registerCourse(course: Course) {
    return this.http
      .post(`${mongooseDB}/create-course`, {
        course,
      })
      .pipe(catchError(this.LecturerAuthService.handleError));
  }
}
