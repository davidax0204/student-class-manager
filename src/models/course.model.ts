export class Course {
  constructor(
    public name: string,
    public startDate: Date,
    public endDate: Date,
    public times: CourseTime,
    public _id?: string
  ) {}
}

export class CourseTime {
  constructor(
    public startHour: string,
    public endHour: string,
    public day: string
  ) {}
}
