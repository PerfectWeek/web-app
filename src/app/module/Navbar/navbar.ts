import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../core/services/auth.service';
import {Router} from '@angular/router';
import {ProfileService} from '../../core/services/profile.service';
import {RequestService} from "../../core/services/request.service";
import {BehaviorSubject, Observable} from "rxjs/Rx";
import {MatDialog} from "@angular/material";
import {AcceptInvitationDialog} from "../dialog/Accept-invitation-dialog/accept-invitation";
import {ToastrService} from "ngx-toastr";
import {Group} from "../../core/models/Group";
import {User} from "../../core/models/User";
import {GroupsService} from "../../core/services/Requests/Groups";
import {UsersService} from "../../core/services/Requests/Users";
import {CalendarsService} from "../../core/services/Requests/Calendars";
import { InvitationsService } from "../../core/services/Requests/Invitations";
import {EventsService} from "../../core/services/Requests/Events";

@Component({
    selector: 'navbar',
    templateUrl: 'navbar.html',
    styleUrls: ['navbar.scss']
})
export class Navbar implements OnInit, AfterViewInit {

    languageList = [
        { code: 'fr', label: 'Français' },
        { code: 'en', label: 'English' }
    ];

    isLogged$ = this.authSrv.isLogged();

    userProfile$ = this.profileSrv.userProfile$;

    groupInvitations: GroupInvitation[] = [];

    friendInvitations: FriendInvitation[] = [];

    EventInvitations: EventInvitation[] = [];

    invitations = this.profileSrv.invitations$.subscribe(invitations => {
        console.log('invitations => ', invitations);
        this.groupInvitations = invitations.group_invitations;
        this.friendInvitations = invitations.friend_invitations;
        this.EventInvitations = invitations.event_invitations;
    });

    constructor(private authSrv: AuthService,
                private router: Router,
                private dialog: MatDialog,
                private toastSrv: ToastrService,
                private requestSrv: RequestService,
                private calendarSrv: CalendarsService,
                private invitationsSrv: InvitationsService,
                private eventSrv: EventsService,
                private groupsSrv: GroupsService,
                private usersSrv: UsersService,
                private profileSrv: ProfileService) {
        if (localStorage.getItem('user_pseudo') != null)
            this.profileSrv.getInvitations();
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        // this.invitations$
        //     .do(invitations => {
        //         this.groupInvitations = invitations.group_invitations;
        //         this.friendInvitations = invitations.friend_invitations;
        //         this.EventInvitations = invitations.event_invitations;
        //     }).subscribe();
    }

    handleGroupRequest(invitation, result) {
        let body = JSON.stringify({group_id: invitation.id});
        if (result === true)
            this.calendarSrv.acceptInvitation(invitation.id)
                .subscribe(ret => {
                    this.toastSrv.success(`Bravo, vous faites maitnenant parti du calendrier ${invitation.name}`);
                    this.profileSrv.getInvitations();
                    this.profileSrv.CalendarsUpdateSubject.next(true);
                }, err => this.toastSrv.error('Une erreur est survenue'));
        else
            this.calendarSrv.declineInvitation(invitation.id)
                .subscribe(ret => {
                    this.toastSrv.success(`Vous avez refusé l'invitation du calendrier ${invitation.name}`);
                    this.profileSrv.getInvitations();
                }, err => this.toastSrv.error('Une erreur est survenue'));
    }

    handleFriendRequest(invitation, result) {
        if (result === true)
            this.invitationsSrv.acceptFriendInvitation(invitation.user.id)
                .subscribe(ret => {
                    this.toastSrv.success(`Bravo, vous êtes maintenant ami avec ${invitation.user.name}`);
                    this.profileSrv.getInvitations();
                    this.profileSrv.friendsUpdatesSubject.next(true);
                }, err => this.toastSrv.error('Une erreur est survenue'));
        else
            this.invitationsSrv.declineFriendInvitation(invitation.user.id)
                .subscribe(ret => {
                    this.toastSrv.success(`Vous avez refusé la demande d'ami de ${invitation.user.name}`);
                    this.profileSrv.getInvitations();
                }, err => this.toastSrv.error('Une erreur est survenue'));
    }

    handleEventRequest(invitation, result) {
        if (result === true)
            this.eventSrv.setEventStatus(invitation.id, "going")
                .subscribe(ret => {
                    this.toastSrv.success(`Bravo, vous faites maintenant parti de l'évènement ${invitation.name}`);
                    this.profileSrv.EventsUpdateSubject.next(true);
                    this.profileSrv.getInvitations();
            });
        else
            this.eventSrv.setEventStatus(invitation.id, "no")
                .subscribe(ret => {
                    this.toastSrv.success(`Vous avez refusé de rejoindre l'évènement ${invitation.name}`);
                    this.profileSrv.getInvitations();
            });
    }

    answerRequest(invitation, type: string) {
        let dialogRef = this.dialog.open(AcceptInvitationDialog, {
            data: {
                type: type,
                body: invitation
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result !== null && result !== undefined) {
                if (type === 'group')
                    this.handleGroupRequest(invitation, result);
                else if (type === "friend")
                    this.handleFriendRequest(invitation, result);
                else
                    this.handleEventRequest(invitation, result);
            }
        })
    }

    logout() {
        this.authSrv.logout();
    }

}
