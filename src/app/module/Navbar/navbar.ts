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

    @ViewChild('UserSearchInput') userSearchInput: ElementRef;

    public searchUser$ = new BehaviorSubject<string>('');

    filteredUsers: BehaviorSubject<User[]>;
    filteredUsers$: Observable<User[]>;

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
        this.filteredUsers = new BehaviorSubject<User[]>([]);
        this.filteredUsers$ = this.filteredUsers.asObservable();
        this.invitations$ = this.profileSrv.invitationsSubject.asObservable();
        this.profileSrv.getInvitations();
    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        this.profileSrv.invitations$
            .do(res => console.log('pro invi => ', res))
            .subscribe();

        this.searchUser$
            .debounceTime(300)
            .distinctUntilChanged()
            .do(() => this.searchUser())
            .subscribe();

        this.invitations$
            .do(invitations => {
                this.groupInvitations = invitations.group_invitations;
                this.friendInvitations = invitations.friend_invitations;
            }).subscribe();
    }

    searchUser() {
        this.filteredUsers.next([]);
        this.requestSrv.get(`search/users`, {
            page_size: 10,
            page_number: 1,
            q:    this.searchUser$.getValue()
        }, {Authorization: ''})
            .subscribe(response => {
                this.filteredUsers.next(response.users);
                }, err => {
                this.toastSrv.error(err.error.message, 'Une erreur est survenue');
            });
    }

    selectedUser(event) {
        this.userSearchInput.nativeElement.value = '';
        this.searchUser$.next('');
        this.router.navigate([`profile/${event.option.viewValue}`]);
    }

    handleGroupRequest(invitation, result) {
        let body = JSON.stringify({group_id: invitation.id});
        if (result === true)
            this.requestSrv.postJSON(`group-invites/${invitation.id}/accept-invite`, body, {Authorization: ''})
                .subscribe(ret => {
                    this.toastSrv.success(`Bravo, vous faites maitnenant parti du group ${invitation.name}`);
                }, err => this.toastSrv.error('Une erreur est survenue'));
        else
            this.requestSrv.postJSON(`groupes-invites/${invitation.id}/decline-invite`, body, {Authorization: ''})
                .subscribe(ret => {
                    this.toastSrv.success(`Vous avez refusé l'invitation du groupe ${invitation.name}`);
                }, err => this.toastSrv.error('Une erreur est survenue'));
    }

    handleFriendRequest(invitation, result) {
        if (result === true)
            this.requestSrv.post(`friend-invites/${invitation.from_user.pseudo}/accept`, {}, {Authorization: ''})
                .subscribe(ret => {
                    this.toastSrv.success(`Bravo, vous êtes maintenant ami avec ${invitation.from_user.pseudo}`);
                }, err => this.toastSrv.error('Une erreur est survenue'));
        else
            this.requestSrv.post(`friend-invites/${invitation.from_user.pseudo}/decline`, {}, {Authorization: ''})
                .subscribe(ret => {
                    this.toastSrv.success(`Vous avez refusé la demande d'ami de ${invitation.from_user.pseudo}`);
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
            if (result && result !== undefined) {
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
