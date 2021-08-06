import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { catchError, map, tap } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
import { User } from 'src/models/student.model';
import { Router } from '@angular/router';
const mongooseDB = environment.NODEJS_SERVER;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  student = new BehaviorSubject<User>(null);
  lecturer = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient, private router: Router) {}

  signUp(firstName: string, lastName: string, email: string, password: string) {
    return this.http
      .post(`${mongooseDB}/create-user`, {
        firstName,
        lastName,
        email,
        password,
      })
      .pipe(catchError(this.handleError));
  }

  signIn(email: string, password: string, isLecturer: boolean) {
    return this.http
      .post<{ student: User; token: string }>(`${mongooseDB}/student-sign-in`, {
        email,
        password,
        isLecturer,
      })
      .pipe(
        catchError(this.handleError),
        map((resData) => {
          this.handleAuthentication(
            resData.student.firstName,
            resData.student.lastName,
            resData.student.email,
            resData.student.token,
            resData.token,
            isLecturer
          );
        })
      );
  }

  signOut() {
    this.student.next(null);
    this.lecturer.next(null);
    localStorage.clear();
    this.router.navigate(['/sign-in']);
  }

  private handleAuthentication(
    firstName: string,
    lastName: string,
    email: string,
    userId: string,
    token: string,
    isLecturer: boolean
  ) {
    if (isLecturer) {
      const lecturer = new User(firstName, lastName, email, userId, token);
      this.lecturer.next(lecturer);
      localStorage.setItem('lecturerData', JSON.stringify(lecturer));
    } else {
      const student = new User(firstName, lastName, email, userId, token);
      this.student.next(student);
      localStorage.setItem('studentData', JSON.stringify(student));
    }
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
