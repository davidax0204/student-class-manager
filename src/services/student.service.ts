import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { Student } from 'src/models/student.model';
import { StudentAuthService } from './student-auth.service';
const mongooseDB = environment.NODEJS_SERVER;

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private StudentAuthService: StudentAuthService
  ) {}

  editProfile(
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    gender: string,
    password?: string
  ) {
    return this.http
      .post<{ student: Student; token: string }>(
        `${mongooseDB}/student-profile/edit`,
        {
          firstName,
          lastName,
          email,
          phoneNumber,
          gender,
          password,
        }
      )
      .pipe(
        catchError(this.StudentAuthService.handleError),
        map((resData) => {
          this.StudentAuthService.handleAuthentication(
            resData.student.firstName,
            resData.student.lastName,
            resData.student.email,
            resData.student.phoneNumber,
            resData.student.gender,
            resData.student._id,
            resData.token
          );
        })
      );
  }
}
