import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LecturerProfileComponent } from './lecturer-profile/lecturer-profile.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { StudentProfileComponent } from './student-profile/student-profile.component';

const routes: Routes = [
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'student-profile', component: StudentProfileComponent },
  { path: 'lecturer-profile', component: LecturerProfileComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
