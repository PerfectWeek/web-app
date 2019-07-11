import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {RequestService} from '../../../core/services/request.service';
import {Router} from '@angular/router';
import {ProfileService} from '../../../core/services/profile.service';
import {BehaviorSubject, Observable} from 'rxjs/Rx';
import {MatDialog} from '@angular/material';
import {Friends} from '../../../core/models/Friends';
import {User} from '../../../core/models/User';
import {ConfirmDialog} from '../../../module/dialog/Confirm-dialog/Confirm-dialog';
import {ToastrService} from 'ngx-toastr';
import {AcceptInvitationDialog} from '../../../module/dialog/Accept-invitation-dialog/accept-invitation';

@Component({
    selector: 'friend-list',
    templateUrl: 'friend-list.html',
    styleUrls: ['friend-list.scss', '../../../../scss/themes/main.scss']
})
export class FriendListComponent implements OnInit, AfterViewInit {
    user: User;

    start = true;

    @ViewChild('UserSearchInput') userSearchInput: ElementRef;

    public searchUser$ = new BehaviorSubject<string>('');

    filteredUsers: BehaviorSubject<User[]>;
    filteredUsers$: Observable<User[]>;

    public searchFriend$ = new BehaviorSubject<string>('');

    ready$: Observable<boolean>;

    ready: BehaviorSubject<boolean>;

    pageSize = 15;

    pageIndex = 0;

    sortingBy = 'name';

    displayFriends: any[];

    input: any;

    friends: Friends[] = [];

    friendInvitations: FriendInvitation[] = [];

    groupInvitations: GroupInvitation[] = [];

    invitations$: Observable<UserInvitations>;

    constructor(private profileSrv: ProfileService,
                private requestSrv: RequestService,
                private toastSrv: ToastrService,
                private router: Router,
                private dialog: MatDialog) {
        this.filteredUsers = new BehaviorSubject<User[]>([]);
        this.filteredUsers$ = this.filteredUsers.asObservable();
        this.ready = new BehaviorSubject<boolean>(false);
        this.ready$ = this.ready.asObservable();
        this.invitations$ = this.profileSrv.invitationsSubject.asObservable();
        if (localStorage.getItem('user_pseudo') != null) {
            this.profileSrv.getInvitations();
        }
    }

    ngOnInit() {
        this.profileSrv.userProfile$.subscribe(user => {
            this.user = user;
        }, (error) => {console.log('error => ', error); });
        this.getFriends();
        this.ready.next(true);
    }

    ngAfterViewInit() {
        this.searchFriend$
            .debounceTime(300)
            .distinctUntilChanged()
            .do(() => this.searchFriend())
            .subscribe();

        this.searchUser$
            .debounceTime(300)
            .distinctUntilChanged()
            .do(() => this.searchUser())
            .subscribe();

        this.ready$
            .do((value) => {
                if (value === true && this.start === true) {
                    this.start = false;
                }
            })
            .subscribe();

        this.invitations$
            .do(invitations => {
                this.groupInvitations = invitations.group_invitations;
                this.friendInvitations = invitations.friend_invitations;
            }).subscribe();
    }

    getFriends() {
        this.requestSrv.get(`friends`, {}, {Authorization: ''})
            .subscribe(response => {
                response.friends.forEach((friend, index) => {
                    this.requestSrv.get(`users/${friend.pseudo}/image`, {}, {Authorization: ''})
                        .subscribe(ret => {
                            this.friends.push({name: friend.pseudo, image: ret.image});
                        });
                    this.displayFriends = this.friends;
                    this.ready.next(true);
                });
            }, err => {
                this.toastSrv.error(err.error.message, 'Une erreur est survenue');
            });
    }

    goToUserProfile(friend) {
        this.router.navigate(['profile', friend.name]);
    }

    removeFriend(friend, index) {
        const dialogRef = this.dialog.open(ConfirmDialog, {data: {
            title: 'Voulez-vous vraiment supprimé cette ami(e) ?'}
        });

        dialogRef.afterClosed().subscribe(results => {
            if (results === true) {
                // this.requestSrv.delete(`userrelationships/id`, {
                // 	response: false,
                // 	request: request.id
                // }, Authorization: '').subscribe(ret => {
                // 	console.log('Accept request ret => ', ret);
                // 	this.friendRequests.splice(index, 1);
                // });
                this.displayFriends.splice(index, 1);
            }
        });
    }

    searchUser() {
        if (localStorage.getItem('user_pseudo') == null) {
            return;
        }
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

    searchFriend() {
        this.pageIndex = 0;
        this.input = this.searchFriend$.getValue().toLowerCase();

        this.displayFriends = [];
        this.displayFriends = this.friends
            .filter((friend: any) => friend.pseudo.toLowerCase().indexOf(this.searchFriend$.getValue().toLowerCase()) != -1);

        /* To be implemented when the routes will be up api wise*/

        // this.displayFriends = [];
        // this.requestSrv.get(`userrelationships`, {
        //     _limit: this.pageSize,
        //     _start: this.pageIndex,
        //     _sort:  this.sortingBy,
        //     "=":    this.searchFriend$.getValue().toLowerCase()
        // }, {Authorization: ''})
        //     .subscribe(ret => {
        // console.log('ret => ', ret);
        //         ret.relations.forEach(request => this.displayRequests.push(request));
        //     }, err => {
        //         this.toastSrv.error(err.error.message, 'Une erreur est survenue');
        //     });

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
                this.handleFriendRequest(invitation, result);
            }
        })
    }

    scrollSearch() {
        ++this.pageIndex;
        const tmp = this.displayFriends;
        tmp.forEach(group => this.displayFriends.push(group));

        /* To be implemented when the routes will be up api wise*/

        // this.requestSrv.get(`userrelationships`, {
        //     _limit: this.pageSize,
        //     _start: this.pageIndex,
        //     _sort:  this.sortingBy,
        //     _contains:    this.searchFriend$.getValue().toLowerCase()
        // }, {Authorization: ''})
        //     .subscribe(ret => {
        //         ret.relations.forEach(requests => this.displayRequests.push(request));
        //     }, err => {
        //         this.toastSrv.error(err.error.message, 'Une erreur est survenue');
        //     });
    }
}
