import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { Student } from 'src/models/student.model';
import { StudentAuthService } from './student-auth.service';
const mongooseDB = environment.NODEJS_SERVER;

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private http: HttpClient, private router: Router) {}

  editProfile(
    firstName: string,
    lastName: string,
    email: string,
    password?: string
  ) {
    return this.http
      .post(`${mongooseDB}/sutdent-profile/edit`, {
        firstName,
        lastName,
        email,
        password,
      })
      .subscribe();
  }
}
