import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LecturerAuthService } from 'src/services/lecturer-auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;
  firstName;
  lastName;
  email;
  phoneNumber;
  gender;
  password;
  passwordRepeated;

  submitMessage;
  isModalOpen = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private AuthService: LecturerAuthService
  ) {
    this.signUpForm = this.formBuilder.group(
      {
        firstName: ['', [Validators.required, this.firstNameValidator]],
        lastName: ['', [Validators.required, this.lastNameValidator]],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: [
          '',
          [
            Validators.required,
            Validators.pattern('[- +()0-9]+'),
            this.phoneNumberValidator,
          ],
        ],
        gender: ['male', Validators.required],
        password: ['', [Validators.required, this.passwordValidator]],
        passwordRepeated: ['', Validators.required],
      },
      {
        validators: this.passwordRepeatedValidator,
      }
    );

    this.firstName = this.signUpForm.get('firstName');
    this.lastName = this.signUpForm.get('lastName');
    this.email = this.signUpForm.get('email');
    this.phoneNumber = this.signUpForm.get('phoneNumber');
    this.gender = this.signUpForm.get('gender');
    this.password = this.signUpForm.get('password');
    this.passwordRepeated = this.signUpForm.get('passwordRepeated');
  }

  ngOnInit(): void {}

  invalidFirstNameMessage() {
    if (this.firstName.errors?.required) {
      return 'You must enter a first name';
    }
    if (this.firstName.errors?.firstNameLettersError) {
      return 'You must enter letters only';
    }
  }

  invalidLastNameMessage() {
    if (this.lastName.errors?.required) {
      return 'You must enter a last name';
    }
    if (this.lastName.errors?.lastNameLettersError) {
      return 'You must enter letters only';
    }
  }

  invalidEmailMessage() {
    if (this.email.errors?.required) {
      return 'You must enter an Email';
    }
    if (this.email.errors?.email) {
      return 'You must enter a valid Email';
    }
  }

  invalidPhoneNumberMessage() {
    if (this.phoneNumber.errors?.required) {
      return 'You must enter an phone number';
    }
    if (this.phoneNumber.errors?.pattern) {
      return 'You must enter a valid phone number';
    }
    if (this.phoneNumber.errors?.phoneNumberLengthError) {
      return 'You phone number missing digits';
    }
  }

  invalidGenderMessage() {
    if (this.gender.errors?.required) {
      return 'You must choose a gender';
    }
  }

  invalidPasswordMessage() {
    if (this.password.errors?.required) {
      return 'You must enter a password';
    }
    if (this.password.errors?.passwordinvalid) {
      return 'A password must contain digits and no spaces';
    }
  }

  invalidPsswordRepeatedMessage() {
    if (this.passwordRepeated.errors?.required) {
      return 'You must repeat on the password';
    }

    if (this.signUpForm.errors?.passwordnotrepeated) {
      return 'Two passwords must ne identical.';
    }
  }

  passwordRepeatedValidator(control: FormGroup): ValidationErrors | null {
    const password = control.get('password').value;
    const passwordRepeated = control.get('passwordRepeated').value;
    return password !== passwordRepeated ? { passwordnotrepeated: true } : null;
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const isIncludesWhiteSpace = control.value.includes(' ');
    const isIncludesDigits = /\d/.exec(control.value);
    const invalid = !isIncludesDigits || isIncludesWhiteSpace;
    return invalid ? { passwordinvalid: true } : null;
  }

  firstNameValidator(control: AbstractControl): ValidationErrors | null {
    return !/^[a-zA-Z\s]*$/.test(control.value)
      ? { firstNameLettersError: true }
      : null;
  }

  lastNameValidator(control: AbstractControl): ValidationErrors | null {
    return !/^[a-zA-Z\s]*$/.test(control.value)
      ? { lastNameLettersError: true }
      : null;
  }

  phoneNumberValidator(control: AbstractControl): ValidationErrors | null {
    return control.value.length < 10 ? { phoneNumberLengthError: true } : null;
  }

  onClickCloseModal() {
    this.isModalOpen = false;
  }

  onSubmitSignUpForm() {
    this.AuthService.signUp(
      this.firstName.value,
      this.lastName.value,
      this.email.value,
      this.phoneNumber.value,
      this.gender.value,
      this.password.value
    ).subscribe(
      () => {
        this.submitMessage = 'The student has been registered';
        this.isModalOpen = true;
      },
      (errorMessage) => {
        this.submitMessage = errorMessage;
        this.isModalOpen = true;
      }
    );
  }
}
