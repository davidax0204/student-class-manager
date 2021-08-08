import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Student } from 'src/models/student.model';
import { LecturerService } from 'src/services/lecturer.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
})
export class StudentsComponent implements OnInit, OnDestroy {
  students: Student[] = [];
  studentsSub: Subscription;

  constructor(private LecturerService: LecturerService) {}

  ngOnInit(): void {
    this.LecturerService.getStudents();
    this.studentsSub = this.LecturerService.students.subscribe(
      (students: Student[]) => {
        this.students = students;
      }
    );
  }

  ngOnDestroy() {
    this.studentsSub.unsubscribe();
  }

  onEditStudent(studentId: string) {
    this.LecturerService.getStudent(studentId);
  }
}
