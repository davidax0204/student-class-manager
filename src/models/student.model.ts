export class User {
  constructor(
    public firstName: string,
    public lastName: string,
    public email: string,
    private _id: string,
    private _token: string
  ) {}

  get token() {
    return this._token;
  }

  get id() {
    return this._id;
  }
}
