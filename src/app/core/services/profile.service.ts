import {Injectable} from '@angular/core';
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
import {CalendarsService} from "./Requests/Calendars";
import {EventsService} from "./Requests/Events";

import * as imageUtils from "../helpers/image"
import {InvitationsService} from "./Requests/Invitations";
import { environment } from "../../../environments/environment";
import { SocketService } from "./socket.service";
import { TokenService } from "./token.service";
import {Friend} from "../models/Friend";

@Injectable()
export class ProfileService {
    private _user: User;
    private _invitations: UserInvitations = {group_invitations: [], friend_invitations: [], event_invitations: []};

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

    invitationsSubject: BehaviorSubject<UserInvitations> = new BehaviorSubject<UserInvitations>({group_invitations: [], friend_invitations: [], event_invitations: []});

    invitations$: Observable<UserInvitations> = this.invitationsSubject.asObservable();

    friendsUpdatesSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    friendsUpdates$: Observable<boolean> = this.friendsUpdatesSubject.asObservable();

    CalendarsUpdateSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    CalendarsUpdate$: Observable<boolean> = this.CalendarsUpdateSubject.asObservable();

    EventsUpdateSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    EventsUpdate$: Observable<boolean> = this.EventsUpdateSubject.asObservable();

    private subscription: Subscription;

    constructor(private requestSrv: RequestService,
                private toastSrv: ToastrService,
                private authSrv: AuthService,
                private usersSrv: UsersService,
                private invitationsSrv: InvitationsService,
                private calendarSrv: CalendarsService,
                private eventSrv: EventsService,
                private groupsSrv: GroupsService,
                private socketService: SocketService,
                private tokenService: TokenService,
    ) {
        if (localStorage.getItem('user_pseudo')) {
            let pseudo = localStorage.getItem('user_pseudo');
            this.subscription = this.authSrv.isLogged().pipe(
                filter(state => state === true),
                switchMap(() => this.fetchUser$())
            ).subscribe();
        }
    }

    initSocketHandler = (token: string) => (socket: SocketIOClient.Socket) => {
        console.log("Socket Mamene !");

        socket.emit("authenticate", { token });

        socket.on("exception", (errorMessage: string) => {
            console.error(`Socket Error: ${errorMessage}`);
        });

        socket.on("calendar_event_added", (data: any) => {
            const {title, description, payload} = data;
            this.getInvitations();
        });

        socket.on("calendar_member_invite", (data: any) => {
            const {title, description, payload} = data;
            this.getInvitations();
        });

        socket.on("event_invitation", (data: any) => {
            const {title, description, payload} = data;
            console.log("event invitation => ", data);
            this.getInvitations();
        });

        socket.on("friend_request", (data: any) => {
            const {title, description, payload} = data;
            this.getInvitations();
        });

        socket.on("friend_accepted", (data: any) => {
            const { title, description, payload } = data;
            this.friendsUpdatesSubject.next(true);
        });
    };


    public clearUser() {
        this.user = null;
        this.userProfileSubject.next(null);
    }

    public getInvitations() {
        this.calendarSrv.getInvitations()
            .subscribe(response => {
                this.invitations.group_invitations = response.calendars;
                this.invitationsSubject.next(this.invitations);
            });

            this.invitationsSrv.getFriends()
            .subscribe(response => {
                this.invitations.friend_invitations = response.received.filter(friend => friend.confirmed === false);
                this.invitationsSubject.next(this.invitations);
            });

            this.eventSrv.getEvents()
                .subscribe(response => {
                    this.invitations.event_invitations = response.events.filter(event => event.status === 'invited');
                    this.invitationsSubject.next(this.invitations);
                })
    }

    public fetchUser$(): Observable<User> {
        return this.usersSrv.getMe()
            .pipe(
                tap((data: any) => {
                    this.user = data.user;
                    // this.getInvitations();

                    // Init sockets
                    this.socketService.initIo(environment.url, this.initSocketHandler(this.tokenService.token));

                    this.userProfileSubject.next(data.user);
                    this.usersSrv.getImage(data.user.id)
                        .subscribe(ret => {
                            imageUtils.createImageFromBlob(ret, this.user);
                        }, err => console.log('err => ', err.message));
                }),
                tap((data: any) => this.user.name = data.user.name),
                tap(null, () => this.authSrv.logout())
            )
    }

    public modify$(user: { name: string, email: string }): Observable<User> {
        return this.usersSrv.modifyUser({
            name: user.name,
            email: user.email
        }).pipe(
            tap(data => {
                {
                    localStorage.setItem('user_pseudo', user.name);
                    this.userProfileSubject.next(data.user);
                    this.user.name = data.user.name;
                }
            })
        )
    }

    public delete$(): Observable<User> {
        return this.usersSrv.deleteUser();
    }
}
