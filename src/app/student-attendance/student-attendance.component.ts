import { Component, OnInit } from '@angular/core';
import { Course } from 'src/models/course.model';
import { Student } from 'src/models/student.model';
import { LecturerService } from 'src/services/lecturer.service';
import { StudentService } from 'src/services/student.service';

@Component({
  selector: 'app-student-attendance',
  templateUrl: './student-attendance.component.html',
  styleUrls: ['./student-attendance.component.css'],
})
export class StudentAttendanceComponent implements OnInit {
  courses: Course[] = [];

  constructor(private lecturerService: LecturerService) {}

  ngOnInit(): void {
    this.lecturerService.selectedStudent.subscribe((student: Student) => {
      this.courses = student.courses;
    });
  }
}
