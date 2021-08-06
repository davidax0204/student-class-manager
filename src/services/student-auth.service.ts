import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { catchError, map, tap } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
import { Student } from 'src/models/student.model';
import { Router } from '@angular/router';
const mongooseDB = environment.NODEJS_SERVER;

@Injectable({
  providedIn: 'root',
})
export class StudentAuthService {
  student = new BehaviorSubject<Student>(null);

  constructor(private http: HttpClient, private router: Router) {}

  signIn(email: string, password: string) {
    return this.http
      .post<{ student: Student; token: string }>(
        `${mongooseDB}/student-sign-in`,
        {
          email,
          password,
        }
      )
      .pipe(
        catchError(this.handleError),
        map((resData) => {
          this.handleAuthentication(
            resData.student.firstName,
            resData.student.lastName,
            resData.student.email,
            resData.student._id,
            resData.token
          );
        })
      );
  }

  autoLogin() {
    const StudentData: Student = JSON.parse(
      localStorage.getItem('studentData')
    );

    if (!StudentData) {
      return;
    }

    const loadedStudent = new Student(
      StudentData.firstName,
      StudentData.lastName,
      StudentData.email,
      StudentData._id,
      StudentData._token
    );

    if (loadedStudent._token) {
      this.student.next(loadedStudent);
    }
  }

  signOut() {
    this.student.next(null);
    localStorage.clear();
    this.router.navigate(['/sign-in']);
  }

  private handleAuthentication(
    firstName: string,
    lastName: string,
    email: string,
    userId: string,
    token: string
  ) {
    const student = new Student(firstName, lastName, email, userId, token);
    this.student.next(student);
    localStorage.setItem('studentData', JSON.stringify(student));
  }

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = 'An Unknown error occurred!';

    if (!errorResponse.error) {
      return throwError(errorMessage);
    }

    switch (errorResponse.error) {
      case 'EMAIL_NOT_UNIQUE':
        errorMessage = 'This email exists already';
        break;

      case 'UNABLE_TO_LOGIN':
        errorMessage = 'Either the email or password or both are invalid';
        break;

      case 'Student validation failed: email: EMAIL_INVALID':
        errorMessage = 'The Email is invalid';
        break;
    }

    return throwError(errorMessage);
  }
}
