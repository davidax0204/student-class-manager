export class Course {
  constructor(
    public name: string,
    public startDate: Date,
    public endDate: Date,
    public times: CourseTime[],
    public _id?: string
  ) {}
}

export class CourseTime {
  constructor(
    public startTime: string,
    public endTime: string,
    public weekDay: string
  ) {}
}
