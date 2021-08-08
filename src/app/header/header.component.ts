import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LecturerAuthService } from 'src/services/lecturer-auth.service';
import { StudentAuthService } from 'src/services/student-auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private studentSub: Subscription;
  isAuthenticatedStudent: boolean = false;

  private lecturerSub: Subscription;
  isAuthenticatedLecturer: boolean = false;

  constructor(
    private StudentAuthService: StudentAuthService,
    private LecturerAuthService: LecturerAuthService
  ) {}

  ngOnInit(): void {
    this.studentSub = this.StudentAuthService.studentHeader.subscribe(
      (logedIn) => {
        this.isAuthenticatedStudent = logedIn;
      }
    );

    this.lecturerSub = this.LecturerAuthService.lecturerHeader.subscribe(
      (logedIn) => {
        this.isAuthenticatedLecturer = logedIn;
      }
    );
  }

  ngOnDestroy() {
    this.studentSub.unsubscribe();
    this.lecturerSub.unsubscribe();
  }

  onStudentSignOut() {
    this.StudentAuthService.signOut();
  }

  onLecturerSignOut() {
    this.LecturerAuthService.signOut();
  }
}
