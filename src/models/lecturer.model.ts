export class Lecturer {
  constructor(
    public firstName: string,
    public lastName: string,
    public email: string,
    public _id: string,
    private _token: string
  ) {}

  get token() {
    return this._token;
  }
}
