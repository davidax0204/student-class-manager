import { Component, OnInit } from '@angular/core';
import { LecturerAuthService } from 'src/services/lecturer-auth.service';
import { LecturerService } from 'src/services/lecturer.service';
import { StudentAuthService } from 'src/services/student-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    private StudentAuthService: StudentAuthService,
    private LecturerAuthService: LecturerAuthService,
    private lecurerSevice: LecturerService
  ) {}

  ngOnInit() {
    this.StudentAuthService.autoLogin();
    this.LecturerAuthService.autoLogin();
    this.lecurerSevice.autoGetStudent();
    this.lecurerSevice.autoGetCourse();
  }
}
