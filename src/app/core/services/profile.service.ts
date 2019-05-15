import {Injectable, OnInit} from '@angular/core';
import {RequestService} from "./request.service";
import { User } from "../models/User";
import {ToastrService} from "ngx-toastr";
import {filter, switchMap, tap} from "rxjs/operators";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {Observable} from "rxjs/Observable";
import {AutthService} from "./auth.service";
import {Subscription} from "rxjs/Subscription";

@Injectable()
export class ProfileService {
  private _user: User;

  set user(user) {this._user = user;}

  get user(): User {return this._user;}

  private userProfileSubject = new ReplaySubject<User>(1);

  userProfile$: Observable<User> = this.userProfileSubject.asObservable();

  private subscription: Subscription;

  constructor(private requestSrv: RequestService,
              private toastSrv: ToastrService,
              private authSrv: AutthService) {
    if (localStorage.getItem('user_pseudo')) {
      let pseudo = localStorage.getItem('user_pseudo');
      this.subscription = this.authSrv.isLogged().pipe(
        filter(state => state === true),
        switchMap(() => this.fetchUser$(pseudo))
      ).subscribe();
    }
  }

  public clearUser() {this.user = null;}

  public fetchUser$(pseudo): Observable<User> {
    return this.requestSrv.get(`users/${pseudo}`, {}, {Authorization: ''})
      .pipe(
        tap((data: any) => {
          this.user = data.user;
          this.userProfileSubject.next(data.user)
        }),
        tap((data: any) => this.user.pseudo = data.user.pseudo),
        tap(null, () => this.authSrv.logout())
      )
  }

  public modify$(user: {pseudo: string, email: string}): Observable<User> {
    return this.requestSrv.put(`users/${this.user.pseudo}`,
      {
        pseudo: user.pseudo,
        email: user.email
    }, {
        Authorization: ''
    }).pipe(
      tap(data => {{
        localStorage.setItem('user_pseudo', user.pseudo);
        this.userProfileSubject.next(data.user);
        this.user.pseudo = data.user.pseudo;
      }})
    )
  }

  public delete$(): Observable<User> {
    return this.requestSrv.delete(`users/${this.user.pseudo}`, {Authorization: ''})
  }
}
