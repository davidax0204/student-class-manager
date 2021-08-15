import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Course } from 'src/models/course.model';
import { LecturerService } from 'src/services/lecturer.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
})
export class CoursesComponent implements OnInit, OnDestroy {
  courses: Course[] = [];
  coursesSub: Subscription;

  constructor(private LecturerService: LecturerService) {}

  ngOnInit(): void {
    this.LecturerService.getCourses();

    this.coursesSub = this.LecturerService.courses.subscribe(
      (courses: Course[]) => {
        this.courses = courses;
      }
    );
  }

  ngOnDestroy() {
    this.coursesSub.unsubscribe();
  }

  onEditCourse(courseId: string) {
    this.LecturerService.getCourse(courseId);
  }

  onAsignStudentsToCourse(courseId) {
    this.LecturerService.getCourse(courseId);
  }

  deleteCourse(courseId) {
    this.LecturerService.removeStudentsFromAssignedCourse(courseId);
    this.LecturerService.deleteCourse(courseId);
  }
}
