import {Injectable} from "@angular/core";
import {RequestService} from "../request.service";
import {Observable} from "rxjs/Rx";
import {User} from "../../models/User";


@Injectable()
export class AuthenticationService {

    constructor(private requestSrv: RequestService) {}

    register(user: User): Observable<any> {
        return this.requestSrv.postJSON('auth/local/register', user, {});
    }

    validateEmail(id: number): Observable<any> {
        return this.requestSrv.get(`auth/local/validate-email/${id}`, {}, {});
    }

    login(body: any): Observable<any> {
        return this.requestSrv.postJSON('auth/local/login', body, {noMultiple: ''});
    }

    facebookAuth(access_token: string, refresh_token?: string): Observable<any> {
        return this.requestSrv.postJSON("auth/facebook/callback", {access_token}, {});
    }

    googleAuth(): Observable<any> {
        return this.requestSrv.get("auth/google/url", {}, {});
    }

    googleCallback(code: any): Observable<any> {
        return this.requestSrv.postJSON('auth/google/callback', {code}, {});
    }
}