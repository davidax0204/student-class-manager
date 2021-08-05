import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnInit {
  signInForm: FormGroup;
  email;
  password;

  isLecturer = false;
  isModalOpen = false;
  signInErrorMessage;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private AuthService: AuthService
  ) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.email = this.signInForm.get('email');
    this.password = this.signInForm.get('password');
  }

  ngOnInit(): void {}

  invalidEmailMessage() {
    if (this.email.errors?.required) {
      return 'You must enter an Email';
    }
    if (this.email.errors?.email) {
      return 'You must enter a valid Email';
    }
  }

  invalidPassword() {
    if (this.password.errors?.required) {
      return 'You must enter a password';
    }
  }

  onClickCloseModal() {
    this.isModalOpen = false;
  }

  onAdminButtonClick() {
    this.isLecturer = !this.isLecturer;
  }

  onSubmitSignInForm() {
    this.AuthService.signIn(
      this.email.value,
      this.password.value,
      this.isLecturer
    ).subscribe(
      () => {},
      (errorMessage) => {
        this.signInErrorMessage = errorMessage;
        this.isModalOpen = true;
      }
    );
  }
}
