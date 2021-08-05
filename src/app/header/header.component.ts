import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private studentSub: Subscription;
  isAuthenticatedStudent: boolean = false;

  constructor(private AuthService: AuthService) {}

  ngOnInit(): void {
    this.studentSub = this.AuthService.student.subscribe((student) => {
      this.isAuthenticatedStudent = !student ? false : true;
    });
  }

  ngOnDestroy() {
    this.studentSub.unsubscribe();
  }

  onSignOut() {
    this.AuthService.signOut();
  }
}
