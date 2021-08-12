import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DatePipe } from '@angular/common';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { LecturerProfileComponent } from './lecturer-profile/lecturer-profile.component';
import { AuthInterceptor } from 'src/interceptors/auth.interceptor';
import { StudentAuthGuard } from '../auth-guards/student-auth.guard';
import { LecturerAuthGuard } from 'src/auth-guards/lecturer-auth.guard';
import { StudentsComponent } from './students/students.component';
import { StudentEditPageComponent } from './student-edit-page/student-edit-page.component';
import { CourseRegisterComponent } from './course-register/course-register.component';
import { LecturerComponent } from './lecturer/lecturer.component';
import { StudentComponent } from './student/student.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CoursesComponent } from './courses/courses.component';
import { CourseEditPageComponent } from './course-edit-page/course-edit-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SignInComponent,
    SignUpComponent,
    StudentProfileComponent,
    LecturerProfileComponent,
    StudentsComponent,
    StudentEditPageComponent,
    CourseRegisterComponent,
    LecturerComponent,
    StudentComponent,
    PageNotFoundComponent,
    CoursesComponent,
    CourseEditPageComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    StudentAuthGuard,
    LecturerAuthGuard,
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
