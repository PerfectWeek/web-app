import {Injectable} from "@angular/core";
import {RequestService} from "../request.service";
import {Observable} from "rxjs/Rx";


@Injectable()
export class AuthenticationService {

    constructor(private requestSrv: RequestService) {}

    validateEmail(id: number): Observable<any> {
        return this.requestSrv.get(`auth/validate-email/${id}`, {}, {});
    }

    login(body: any): Observable<any> {
        return this.requestSrv.post('auth/login', body, {noMultiple: ''});
    }

    facebookAuth(access_token: string, refresh_token: string): Observable<any> {
        return this.requestSrv.get("auth/providers/facebook/callback", {
            access_token: access_token,
            refresh_token: refresh_token
        }, {});
    }

    googleAuth(access_token: string, refresh_token: string): Observable<any> {
        return this.requestSrv.get("auth/providers/google/callback",{
            access_token: access_token,
            refresh_token: refresh_token
        }, {});
    }
}