import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { StudentAuthService } from 'src/services/student-auth.service';

@Injectable()
export class StudentAuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private StudentAuthService: StudentAuthService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    return this.StudentAuthService.student.pipe(
      (take(1),
      map((student) => {
        const isAuth = !student ? false : true;
        if (isAuth) {
          return true;
        }
        return this.router.createUrlTree(['/sign-in']);
      }))
    );
  }
}
