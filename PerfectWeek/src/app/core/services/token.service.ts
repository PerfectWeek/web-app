import {Injectable} from "@angular/core";

@Injectable()
export class TokenService {
  private _token: string;

  get token(): string {
    return this._token;
  }

  set token(value: string) {
    localStorage.setItem("token", value);
    this._token = value;
  }

  constructor() {
    this._token = localStorage.getItem("token");
  }
}
