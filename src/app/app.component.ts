import { Component, OnInit } from '@angular/core';
import { StudentAuthService } from 'src/services/student-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private StudentAuthService: StudentAuthService) {}
  ngOnInit() {
    this.StudentAuthService.autoLogin();
  }
}
