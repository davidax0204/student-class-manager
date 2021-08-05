export class Student {
  constructor(
    public firstName: string,
    public lastName: string,
    public email: string,
    public _id: string,
    public _token: string
  ) {}

  get token() {
    return this._token;
  }

  get id() {
    return this._id;
  }
}
