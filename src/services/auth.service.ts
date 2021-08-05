import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
const mongooseDB = environment.NODEJS_SERVER;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

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

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = 'An Unknown error occurred!';

    if (!errorResponse.error) {
      return throwError(errorMessage);
    }

    switch (errorResponse.error) {
      case 'EMAIL_NOT_UNIQUE':
        errorMessage = 'This email exists already';
        break;

      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email not exist';
        break;

      case 'INVALID_PASSWORD':
        errorMessage = 'This password is invalid';
        break;
    }

    return throwError(errorMessage);
  }
}
