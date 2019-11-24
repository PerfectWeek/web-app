import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {RequestService} from "../../../core/services/request.service";
import {Router} from "@angular/router";
import {ProfileService} from "../../../core/services/profile.service";
import {BehaviorSubject, Observable} from "rxjs/Rx";
import {MatDialog} from "@angular/material";
import {Friends} from "../../../core/models/Friends";
import {User} from "../../../core/models/User";
import {ConfirmDialog} from "../../../module/dialog/Confirm-dialog/Confirm-dialog";
import {ToastrService} from "ngx-toastr";
import {UsersService} from "../../../core/services/Requests/Users";
import {InvitationsService} from "../../../core/services/Requests/Invitations";

import * as imageUtils from "../../../core/helpers/image"

@Component({
    selector: 'friend-list',
    templateUrl: 'friend-list.html',
    styleUrls: ['friend-list.scss', '../../../../scss/themes/main.scss']
})
export class FriendListComponent implements OnInit, AfterViewInit {
    user: User;

    start: boolean = true;

    @ViewChild('UserSearchInput') userSearchInput: ElementRef;

    public searchUser$ = new BehaviorSubject<string>('');

    filteredUsers: BehaviorSubject<User[]>;
    filteredUsers$: Observable<User[]>;

    public searchFriend$ = new BehaviorSubject<string>('');

    ready$: Observable<boolean>;

    ready: BehaviorSubject<boolean>;

    pageSize: number = 15;

    pageIndex: number = 0;

    sortingBy: string = "name";

    displayFriends: any[];

    input: any;

    friends: any[] = [];

    constructor(private profileSrv: ProfileService,
                private requestSrv: RequestService,
                private usersSrv: UsersService,
                private invitationsSrv: InvitationsService,
                private toastSrv: ToastrService,
                private router: Router,
                private dialog: MatDialog) {
        this.filteredUsers = new BehaviorSubject<User[]>([]);
        this.filteredUsers$ = this.filteredUsers.asObservable();
        this.ready = new BehaviorSubject<boolean>(false);
        this.ready$ = this.ready.asObservable();
    }

    ngOnInit() {
        this.profileSrv.userProfile$.subscribe(user => {
            this.user = user;
        }, (error) => {
            console.log('error => ', error)
        });
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
    }

    getFriends() {
        this.invitationsSrv.getFriends()
            .subscribe(response => {
                let friendsInvitations: any[] = [...response.received.filter(req => req.confirmed === true), ...response.sent.filter(req => req.confirmed === true)];
                friendsInvitations.forEach((friend, index) => {
                    this.usersSrv.getImage(friend.user.id)
                        .subscribe(ret => {
                            let obj: {image: any} = {image: null};
                            imageUtils.createImageFromBlob(ret, obj);
                            setTimeout(() => this.friends.push({name: friend.user.name, id: friend.user.id, image: obj.image}), 50);
                        });
                    if (index >= friendsInvitations.length - 1) {
                        this.displayFriends = this.friends;
                        this.ready.next(true);
                    }
                });
            }, err => {
                this.toastSrv.error(err.error.message, 'Une erreur est survenue');
            });
    }

    goToUserProfile(friend) {
        this.router.navigate([`profile/${friend.id}`]);
    }

    removeFriend(friend, index) {
        let dialogRef = this.dialog.open(ConfirmDialog, {
            data: {
                title: "Voulez-vous vraiment supprimé cette ami(e) ?"
            }
        });

        dialogRef.afterClosed().subscribe(results => {
            if (results === true) {
                // this.requestSrv.delete(`userrelationships/id`, {
                // 	response: false,
                // 	request: request.id
                // }, Authorization: '').subscribe(ret => {
                // 	this.friendRequests.splice(index, 1);
                // });
                this.displayFriends.splice(index, 1);
            }
        });
    }

    searchUser() {
        if (localStorage.getItem('user_pseudo') == null)
            return;
        this.filteredUsers.next([]);
        this.usersSrv.searchUser({
            page_size: 10,
            page_number: 1,
            q: this.searchUser$.getValue()
        })
            .subscribe(response => {
                this.filteredUsers.next(response.users);
            }, err => {
                this.toastSrv.error(err.error.message, 'Une erreur est survenue');
            });
    }

    selectedUser(event) {
        this.userSearchInput.nativeElement.value = '';
        this.searchUser$.next('');
        this.router.navigate([`profile/${event.option.value.id}`]);
    }

    searchFriend() {
        this.pageIndex = 0;
        if (this.searchFriend$)
            this.input = this.searchFriend$.getValue().toLowerCase();

        this.displayFriends = [];
        this.displayFriends = this.friends
            .filter((friend: any) => friend.name.toLowerCase().indexOf(this.searchFriend$.getValue().toLowerCase()) != -1);

        /* To be implemented when the routes will be up api wise*/

        // this.displayFriends = [];
        // this.requestSrv.get(`userrelationships`, {
        //     _limit: this.pageSize,
        //     _start: this.pageIndex,
        //     _sort:  this.sortingBy,
        //     "=":    this.searchFriend$.getValue().toLowerCase()
        // }, {Authorization: ''})
        //     .subscribe(ret => {
        //         ret.relations.forEach(request => this.displayRequests.push(request));
        //     }, err => {
        //         this.toastSrv.error(err.error.message, 'Une erreur est survenue');
        //     });

    }

    scrollSearch() {
        // ++this.pageIndex;
        // let tmp = this.displayFriends;
        // tmp.forEach(group => this.displayFriends.push(group));

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