import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
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

  constructor(
    private http: HttpClient,
    private LecturerAuthService: LecturerAuthService,
    private router: Router
  ) {}

  editProfile(firstName: string, lastName: string, password?: string) {
    return this.http
      .post<{ lecturer: Lecturer; token: string }>(
        `${mongooseDB}/lecturer-profile/edit`,
        {
          firstName,
          lastName,
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
            resData.lecturer._id,
            resData.token
          );
        })
      );
  }

  getStudents() {
    this.http
      .get(`${mongooseDB}/students`)
      .pipe(
        map((students: Student[]) => {
          this.students.next(students);
        })
      )
      .subscribe();
  }

  getStudent(studentId: string) {
    this.http
      .get(`${mongooseDB}/students/${studentId}`)
      .pipe(
        map((student: Student) => {
          this.selectedStudent.next(student);
          localStorage.setItem('editedStudentId', student._id);
        })
      )
      .subscribe();
  }

  autoGetStudent() {
    this.getStudent(localStorage.getItem('editedStudentId'));
  }
}
