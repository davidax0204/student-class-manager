import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Student } from 'src/models/student.model';

@Injectable({
  providedIn: 'root',
})
export class StudentCoursesResolver implements Resolve<Student[]> {
  LecturerService: any;
  constructor() {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.LecturerService.getStudents();
  }
}
