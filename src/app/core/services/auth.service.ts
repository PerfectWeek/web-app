import {Injectable} from '@angular/core';
import {RequestService} from './request.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/last';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {TokenService} from './token.service';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/empty';
import {User} from "../models/User";
import 'rxjs/add/operator/switchMap';
import {ReplaySubject} from "rxjs/ReplaySubject";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {AuthenticationService} from "./Requests/Authentication";

@Injectable()
export class AuthService {
    get logged(): boolean {
        return this._logged;
    }

    set logged(value: boolean) {
        if (value !== this._logged) {
            this.isLoggedSubject.next(value);
        }
        if (value === false) {
            this.auth = null;
        }
        this._logged = value;
    }

    private _logged: boolean;

    clearData() {
        this.auth = null;
        this.tokenSrv.clear();
        localStorage.removeItem('user_pseudo');
    }

    set auth(value: User) {
        this._auth = value;
        if (value != null) {
            localStorage.setItem('auth', JSON.stringify(value));
        } else {
            localStorage.removeItem('auth');
        }
    }

    get auth(): User {
        return this._auth;
    }

    private _auth: User = null;

    finishInit = false;

    private isLoggedSubject = new ReplaySubject<boolean>(1);

    isLoggedObservable: Observable<boolean> = this.isLoggedSubject.asObservable();

    constructor(private requestSrv: RequestService,
                private router: Router,
                private tokenSrv: TokenService,
                private toastSrv: ToastrService,
                private authSrv: AuthenticationService) {
        if (localStorage.getItem('auth'))
            this._auth = JSON.parse(localStorage.getItem('auth'));
    }

    isLogged(): Observable<boolean> {
        if (this.finishInit === true) {// If we already try to connect, just send the status
            return (this.isLoggedObservable);
        }
        this.finishInit = true;

        if (this.canConnect() === true && this.tokenSrv.token === null) {
            return this.connection()
                .switchMap(() => this.isLoggedObservable)
                .catch(() => this.isLoggedObservable);
        }

        this.logged = this.canConnect();

        return this.isLoggedObservable;
    }

    canConnect(): boolean {
        return this.auth != null;
    }

    newConnection(newInfo: User): Observable<void> {
        this.auth = newInfo;
        return this.connection();
    }

    connection(): Observable<void> {
        return this.authSrv.login(this.auth).do((data: any) => {
            localStorage.setItem('user_pseudo', data.user.name);
            this.tokenSrv.token = data.token;
        })
            .do(() => this.logged = true, () => this.logged = false);
    }

    newGoogleConnection(data) {
        this.auth = data.user;
        localStorage.setItem('user_pseudo', data.user.name);
        this.tokenSrv.token = data.token;
        this.logged = true;
    }

    changeAuth(modification: User): void {
        if (modification.email && modification.email !== this.auth.email) {
            this.auth = {email: modification.email, password: this.auth.password, name: this.auth.name};
        }
        if (modification.password && modification.password !== this.auth.password) {
            this.auth = {email: this.auth.email, password: modification.password, name: modification.name};
        }
    }

    logout() {
        this.logged = false;
        this.clearData();
        this.router.navigate(['/login']);
        this.toastSrv.info('Vous avez été déconnecté avec succès')
        // return this.requestSrv.delete('logout', {
        //   noMultiple: '',
        //   'Authorization': '',
        // })
        //   .do(() => {
        //     localStorage.removeItem('user_pseudo');
        //     this.logged = false
        //   })
        //   .do(() => {
        //     this.auth = null;
        //     this.router.navigate(['/login']);
        //   });
    }
}
