import { Component, OnInit } from '@angular/core';
import { Course } from 'src/models/course.model';
import { StudentService } from 'src/services/student.service';

@Component({
  selector: 'app-student-courses',
  templateUrl: './student-courses.component.html',
  styleUrls: ['./student-courses.component.css'],
})
export class StudentCoursesComponent implements OnInit {
  courses: Course[] = [];

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.studentService.getCourses();
    this.studentService.courses.subscribe((courses: Course[]) => {
      this.courses = courses;
    });
  }

  onYesAttendance(courseId: string, dayId: string) {
    this.studentService.accpetAttendance(courseId, dayId);
  }
}
