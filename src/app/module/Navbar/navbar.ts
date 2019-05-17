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

@Component({
    selector: 'navbar',
    templateUrl: 'navbar.html',
    styleUrls: ['navbar.scss']
})
export class Navbar implements OnInit, AfterViewInit {

    isLogged$ = this.authSrv.isLogged();

    userProfile$ = this.profileSrv.userProfile$;

    groupInvitations: GroupInvitation[] = [];

    friendInvitations: FriendInvitation[] = [];

    invitations$: Observable<UserInvitations>;

    constructor(private authSrv: AuthService,
                private router: Router,
                private dialog: MatDialog,
                private toastSrv: ToastrService,
                private requestSrv: RequestService,
                private profileSrv: ProfileService) {
        this.invitations$ = this.profileSrv.invitationsSubject.asObservable();
        if (localStorage.getItem('user_pseudo') != null)
            this.profileSrv.getInvitations();
    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        this.invitations$
            .do(invitations => {
                this.groupInvitations = invitations.group_invitations;
                this.friendInvitations = invitations.friend_invitations;
            }).subscribe();
    }

    handleGroupRequest(invitation, result) {
        let body = JSON.stringify({group_id: invitation.id});
        if (result === true)
            this.requestSrv.postJSON(`group-invites/${invitation.id}/accept-invite`, body, {Authorization: ''})
                .subscribe(ret => {
                    this.toastSrv.success(`Bravo, vous faites maitnenant parti du group ${invitation.name}`);
                    this.profileSrv.getInvitations();
                }, err => this.toastSrv.error('Une erreur est survenue'));
        else
            this.requestSrv.postJSON(`group-invites/${invitation.id}/decline-invite`, body, {Authorization: ''})
                .subscribe(ret => {
                    this.toastSrv.success(`Vous avez refusé l'invitation du groupe ${invitation.name}`);
                    this.profileSrv.getInvitations();
                }, err => this.toastSrv.error('Une erreur est survenue'));
    }

    handleFriendRequest(invitation, result) {
        if (result === true)
            this.requestSrv.post(`friend-invites/${invitation.from_user.pseudo}/accept`, {}, {Authorization: ''})
                .subscribe(ret => {
                    this.toastSrv.success(`Bravo, vous êtes maintenant ami avec ${invitation.from_user.pseudo}`);
                    this.profileSrv.getInvitations();
                }, err => this.toastSrv.error('Une erreur est survenue'));
        else
            this.requestSrv.post(`friend-invites/${invitation.from_user.pseudo}/decline`, {}, {Authorization: ''})
                .subscribe(ret => {
                    this.toastSrv.success(`Vous avez refusé la demande d'ami de ${invitation.from_user.pseudo}`);
                    this.profileSrv.getInvitations();
                }, err => this.toastSrv.error('Une erreur est survenue'));
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
                else
                    this.handleFriendRequest(invitation, result);
            }
        })
    }

    logout() {
        this.authSrv.logout();
    }

}
