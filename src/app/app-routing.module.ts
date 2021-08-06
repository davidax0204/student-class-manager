import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LecturerProfileComponent } from './lecturer-profile/lecturer-profile.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { StudentAuthGuard } from '../auth-guards/student-auth.guard';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { LecturerAuthGuard } from 'src/auth-guards/lecturer-auth.guard';

const routes: Routes = [
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  {
    path: 'student-profile',
    component: StudentProfileComponent,
    canActivate: [StudentAuthGuard],
  },
  {
    path: 'lecturer-profile',
    component: LecturerProfileComponent,
    canActivate: [LecturerAuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
