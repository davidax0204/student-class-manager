import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { Lecturer } from 'src/models/lecturer.model';
import { LecturerAuthService } from './lecturer-auth.service';
const mongooseDB = environment.NODEJS_SERVER;

@Injectable({
  providedIn: 'root',
})
export class LecturerService {
  constructor(
    private http: HttpClient,
    private LecturerAuthService: LecturerAuthService
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
}
