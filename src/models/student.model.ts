export class Student {
  constructor(
    public firstName: string,
    public lastName: string,
    public email: string,
    public phoneNumber: string,
    public gender: string,
    public _id: string,
    public _token: string,
    public password?: string
  ) {}
}
