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
import { LecturerAuthService } from 'src/services/lecturer-auth.service';

@Injectable()
export class LecturerAuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private LecturerAuthService: LecturerAuthService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    return this.LecturerAuthService.lecturer.pipe(
      (take(1),
      map((lecturer) => {
        const isAuth = !lecturer ? false : true;
        if (isAuth) {
          return true;
        }
        return this.router.createUrlTree(['/sign-in']);
      }))
    );
  }
}
