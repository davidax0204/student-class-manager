import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Lecturer } from 'src/models/lecturer.model';
import { LecturerAuthService } from 'src/services/lecturer-auth.service';
import { LecturerService } from 'src/services/lecturer.service';
import { StudentAuthService } from 'src/services/student-auth.service';

@Component({
  selector: 'app-lecturer-profile',
  templateUrl: './lecturer-profile.component.html',
  styleUrls: ['./lecturer-profile.component.css'],
})
export class LecturerProfileComponent implements OnInit {
  activeLecturer: Lecturer;
  lecturerSub: Subscription;

  profilePage: FormGroup;
  firstName;
  lastName;
  email;
  phoneNumber;
  gender;
  password;
  passwordRepeated;

  isModalOpen = false;
  msg;

  constructor(
    private formBuilder: FormBuilder,
    private LecturerAuthService: LecturerAuthService,
    private LecturerService: LecturerService
  ) {
    this.profilePage = this.formBuilder.group(
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
        password: ['', this.passwordValidator],
        passwordRepeated: [''],
      },
      {
        validators: this.passwordRepeatedValidator,
      }
    );

    this.firstName = this.profilePage.get('firstName');
    this.lastName = this.profilePage.get('lastName');
    this.email = this.profilePage.get('email');
    this.phoneNumber = this.profilePage.get('phoneNumber');
    this.gender = this.profilePage.get('gender');
    this.password = this.profilePage.get('password');
    this.passwordRepeated = this.profilePage.get('passwordRepeated');
  }

  ngOnInit(): void {
    this.lecturerSub = this.LecturerAuthService.lecturer.subscribe(
      (lecturer) => {
        this.activeLecturer = !lecturer ? null : lecturer;
        if (this.activeLecturer) {
          this.profilePage.controls['firstName'].setValue(
            this.activeLecturer.firstName
          );
          this.profilePage.controls['lastName'].setValue(
            this.activeLecturer.lastName
          );
          this.profilePage.controls['email'].setValue(
            this.activeLecturer.email
          );
          this.profilePage.controls['phoneNumber'].setValue(
            this.activeLecturer.phoneNumber
          );
          this.profilePage.controls['gender'].setValue(
            this.activeLecturer.gender
          );
        }
      }
    );
  }

  ngOnDestroy() {
    this.lecturerSub.unsubscribe();
  }

  invalidFirstNameMessage() {
    if (this.firstName.errors?.required) {
      return 'You must enter your first name';
    }
    if (this.firstName.errors?.firstNameLettersError) {
      return 'Your first name must contain letters only';
    }
  }
  invalidLastNameMessage() {
    if (this.lastName.errors?.required) {
      return 'You must enter your last name';
    }
    if (this.lastName.errors?.lastNameLettersError) {
      return 'Your last name must contain letters only';
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

  invalidPassword() {
    if (this.password.errors?.passwordinvalid) {
      return 'A password must contain digits and no spaces';
    }
  }

  invalidPsswordRepeatedMessage() {
    if (this.passwordRepeated.errors?.required) {
      return 'You must repeat on the password';
    }

    if (this.profilePage.errors?.passwordnotrepeated) {
      return 'Two passwords must be identical.';
    }
  }

  passwordRepeatedValidator(control: FormGroup): ValidationErrors | null {
    const password = control.get('password').value;
    const passwordRepeated = control.get('passwordRepeated').value;
    return password !== passwordRepeated ? { passwordnotrepeated: true } : null;
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value.length === 0) {
      return null;
    }
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

  onClickLogOut() {}

  onSubmitProfileEditForm() {
    if (!this.password.value) {
      this.LecturerService.editProfile(
        this.firstName.value,
        this.lastName.value,
        this.phoneNumber.value,
        this.gender.value
      ).subscribe(
        () => {
          this.isModalOpen = true;
          this.msg = 'Your changes are successfully saved';
        },
        (errorMessage) => {
          this.isModalOpen = true;
          this.msg = errorMessage;
        }
      );
    } else {
      this.LecturerService.editProfile(
        this.firstName.value,
        this.lastName.value,
        this.phoneNumber.value,
        this.gender.value,
        this.password.value
      ).subscribe(
        () => {
          this.isModalOpen = true;
          this.msg = 'Your changes are successfully saved';
        },
        (errorMessage) => {
          this.isModalOpen = true;
          this.msg = errorMessage;
        }
      );
    }
  }
}
