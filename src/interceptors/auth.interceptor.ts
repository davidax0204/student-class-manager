import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpParams,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudentAuthService } from 'src/services/student-auth.service';
import { exhaustMap, take } from 'rxjs/operators';
import { LecturerAuthService } from 'src/services/lecturer-auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private StudentAuthService: StudentAuthService,
    private LecturerAuthService: LecturerAuthService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    if (localStorage.studentData) {
      return this.StudentAuthService.student.pipe(
        take(1),
        exhaustMap((student) => {
          if (!student) {
            return next.handle(request);
          }
          const modifiedReq = request.clone({
            params: new HttpParams()
              .set('auth', student._token)
              .set('id', student._id),
          });
          return next.handle(modifiedReq);
        })
      );
    } else {
      return this.LecturerAuthService.lecturer.pipe(
        take(1),
        exhaustMap((lecturer) => {
          if (!lecturer) {
            return next.handle(request);
          }
          const modifiedReq = request.clone({
            params: new HttpParams()
              .set('auth', lecturer._token)
              .set('id', lecturer._id),
          });
          return next.handle(modifiedReq);
        })
      );
    }
  }
}
