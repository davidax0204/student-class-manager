export class Lecturer {
  constructor(
    public firstName: string,
    public lastName: string,
    public email: string,
    public _id: string,
    public _token: string,
    public password?: string
  ) {}
}
