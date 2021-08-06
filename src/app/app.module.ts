import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { LecturerAuthService } from 'src/services/lecturer-auth.service';
import { LecturerProfileComponent } from './lecturer-profile/lecturer-profile.component';
import { AuthInterceptor } from 'src/interceptors/auth.interceptor';
import { StudentAuthGuard } from '../auth-guards/student-auth.guard';
import { LecturerAuthGuard } from 'src/auth-guards/lecturer-auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SignInComponent,
    SignUpComponent,
    StudentProfileComponent,
    LecturerProfileComponent,
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
