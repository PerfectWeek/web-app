import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AuthService} from '../../core/services/auth.service';
import {Router} from '@angular/router';
import {ProfileService} from '../../core/services/profile.service';
import {RequestService} from "../../core/services/request.service";
import {BehaviorSubject, Observable} from "rxjs/Rx";
import {MatDialog} from "@angular/material";
import {AcceptInvitationDialog} from "../dialog/Accept-invitation-dialog/accept-invitation";
import {ToastrService} from "ngx-toastr";
import {Group} from "../../core/models/Group";

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
        this.profileSrv.getInvitations();
    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        this.profileSrv.invitations$
            .do(res => console.log('pro invi => ', res))
            .subscribe();

        this.invitations$
            .do(invitations => {
                console.log('invitations => ', invitations);
                this.groupInvitations = invitations.group_invitations;
                this.friendInvitations = invitations.friend_invitations;
            }).subscribe();
    }

    answerRequest(invitation: GroupInvitation) {
        let dialogRef = this.dialog.open(AcceptInvitationDialog, {
            data: {
                type: 'group',
                group_name: invitation.name
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === true)
                this.requestSrv.post(`groupes-invites/${invitation.id}/accept-invite`, {
                    group_id: invitation.id
                }, {Authorization: ''})
                    .subscribe(ret => {
                        this.toastSrv.success(`Bravo, vous faites maitnenant parti du group ${invitation.name}`);
                    }, err => this.toastSrv.error('Une erreur est survenue'));
            else
                this.requestSrv.post(`groupes-invites/${invitation.id}/decline-invite`, {
                    group_id: invitation.id
                }, {Authorization: ''})
                    .subscribe(ret => {
                        this.toastSrv.success(`Vous avez refusé l'invitation du groupe ${invitation.name}`);
                    }, err => this.toastSrv.error('Une erreur est survenue'));
        })
    }

    logout() {
        this.authSrv.logout();
    }

}
