import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { catchError, map, tap } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
import { Lecturer } from 'src/models/lecturer.model';
import { Router } from '@angular/router';
const mongooseDB = environment.NODEJS_SERVER;

@Injectable({
  providedIn: 'root',
})
export class LecturerAuthService {
  lecturer = new BehaviorSubject<Lecturer>(null);
  lecturerHeader = new BehaviorSubject<boolean>(false);

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

  signIn(email: string, password: string) {
    return this.http
      .post<{ lecturer: Lecturer; token: string }>(
        `${mongooseDB}/lecturer-sign-in`,
        {
          email,
          password,
        }
      )
      .pipe(
        catchError(this.handleError),
        map((resData) => {
          this.handleAuthentication(
            resData.lecturer.firstName,
            resData.lecturer.lastName,
            resData.lecturer.email,
            resData.lecturer._id,
            resData.token
          );
        })
      );
  }

  signOut() {
    this.http.get(`${mongooseDB}/lecturer-log-out`).subscribe();
    this.lecturer.next(null);
    this.lecturerHeader.next(false);
    localStorage.clear();
    this.router.navigate(['/sign-in']);
  }

  autoLogin() {
    const lecturerData: Lecturer = JSON.parse(
      localStorage.getItem('lecturerData')
    );

    if (!lecturerData) {
      return;
    }

    const loadedLecturer = new Lecturer(
      lecturerData.firstName,
      lecturerData.lastName,
      lecturerData.email,
      lecturerData._id,
      lecturerData._token
    );

    if (loadedLecturer._token) {
      this.lecturer.next(loadedLecturer);
      this.lecturerHeader.next(true);
    }
  }

  public handleAuthentication(
    firstName: string,
    lastName: string,
    email: string,
    userId: string,
    token: string
  ) {
    const lecturer = new Lecturer(firstName, lastName, email, userId, token);
    this.lecturer.next(lecturer);
    this.lecturerHeader.next(true);
    localStorage.setItem('lecturerData', JSON.stringify(lecturer));
  }

  public handleError(errorResponse: HttpErrorResponse) {
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
