import {Injectable, OnInit} from '@angular/core';
import {RequestService} from "./request.service";
import {User} from "../models/User";
import {ToastrService} from "ngx-toastr";
import {filter, switchMap, tap} from "rxjs/operators";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {Observable} from "rxjs/Observable";
import {AuthService} from "./auth.service";
import {Subscription} from "rxjs/Subscription";
import {BehaviorSubject} from "rxjs/Rx";
import {UsersService} from "./Requests/Users";
import {GroupsService} from "./Requests/Groups";

@Injectable()
export class ProfileService {
    private _user: User;
    private _invitations: UserInvitations = {group_invitations: [], friend_invitations: []};

    set user(user) {
        this._user = user;
    }

    get user(): User {
        return this._user;
    }

    get invitations() {
        return this._invitations;
    }

    private userProfileSubject = new ReplaySubject<User>(1);

    userProfile$: Observable<User> = this.userProfileSubject.asObservable();

    invitationsSubject: BehaviorSubject<UserInvitations>;

    invitations$: Observable<UserInvitations>;

    private subscription: Subscription;

    constructor(private requestSrv: RequestService,
                private toastSrv: ToastrService,
                private authSrv: AuthService,
                private usersSrv: UsersService,
                private groupsSrv: GroupsService) {
        this.invitationsSubject = new BehaviorSubject<UserInvitations>({group_invitations: [], friend_invitations: []});
        this.invitations$ = this.invitationsSubject.asObservable();

        if (localStorage.getItem('user_pseudo')) {
            let pseudo = localStorage.getItem('user_pseudo');
            this.subscription = this.authSrv.isLogged().pipe(
                filter(state => state === true),
                switchMap(() => this.fetchUser$(pseudo))
            ).subscribe();
        }
    }

    public clearUser() {
        this.user = null;
        this.userProfileSubject.next(null);
    }

    public getInvitations() {
        this.groupsSrv.getGroupInvitations()
            .subscribe(response => {
                this.invitations.group_invitations = response.pending_invites;
                this.invitationsSubject.next(this.invitations);
            });

            this.usersSrv.getFriendInvitations()
            .subscribe(response => {
                this.invitations.friend_invitations = response.friend_requests;
                this.invitationsSubject.next(this.invitations);
            });
    }

    public fetchUser$(pseudo): Observable<User> {
        return this.usersSrv.getUser(pseudo)
            .pipe(
                tap((data: any) => {
                    this.user = data.user;
                    this.getInvitations();
                    this.userProfileSubject.next(data.user)
                }),
                tap((data: any) => this.user.pseudo = data.user.pseudo),
                tap(null, () => this.authSrv.logout())
            )
    }

    public modify$(user: { pseudo: string, email: string }): Observable<User> {
        return this.usersSrv.modifyUser(this.user.pseudo, {
            pseudo: user.pseudo,
            email: user.email
        }).pipe(
            tap(data => {
                {
                    localStorage.setItem('user_pseudo', user.pseudo);
                    this.userProfileSubject.next(data.user);
                    this.user.pseudo = data.user.pseudo;
                }
            })
        )
    }

    public delete$(): Observable<User> {
        return this.usersSrv.deleteUser(this.user.pseudo);
    }
}
