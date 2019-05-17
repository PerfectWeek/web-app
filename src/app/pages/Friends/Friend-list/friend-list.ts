import {AfterViewInit, Component, OnInit} from "@angular/core";
import {RequestService} from "../../../core/services/request.service";
import {Router} from "@angular/router";
import {ProfileService} from "../../../core/services/profile.service";
import {BehaviorSubject, Observable} from "rxjs/Rx";
import {MatDialog} from "@angular/material";
import {Friends} from "../../../core/models/Friends";
import {User} from "../../../core/models/User";
import {ConfirmDialog} from "../../../module/dialog/Confirm-dialog/Confirm-dialog";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'friend-list',
    templateUrl: 'friend-list.html',
    styleUrls: ['friend-list.scss', '../../../../scss/themes/main.scss']
})
export class FriendListComponent implements OnInit, AfterViewInit {
    user: User;

    start: boolean = true;

    public searchFriend$ = new BehaviorSubject<string>('');

    ready$: Observable<boolean>;

    ready: BehaviorSubject<boolean>;

    pageSize: number = 15;

    pageIndex: number = 0;

    sortingBy: string = "name";

    displayFriends: any[];

    input: any;

    friends: Friends[] = [];

    constructor(private profileSrv: ProfileService,
                private requestSrv: RequestService,
                private toastSrv: ToastrService,
                private router: Router,
                private dialog: MatDialog) {
        this.ready = new BehaviorSubject<boolean>(false);
        this.ready$ = this.ready.asObservable();
    }

    ngOnInit() {
        this.profileSrv.userProfile$.subscribe(user => {
            this.user = user;
        }, (error) => {console.log('error => ', error)});
        this.getFriends();
        this.ready.next(true);
    }

    ngAfterViewInit() {
        this.searchFriend$
            .debounceTime(300)
            .distinctUntilChanged()
            .do(() => this.searchFriend())
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
        this.requestSrv.get(`friends`, {}, {Authorization: ''})
            .subscribe(response => {
                this.friends = response.friends;
                this.ready.next(true);
            }, err => {
                this.toastSrv.error(err.error.message, 'Une erreur est survenue');
            });
    }

    goToUserProfile(friend) {
        this.router.navigate(["profile", friend.name]);
    }

    removeFriend(friend, index) {
        let dialogRef = this.dialog.open(ConfirmDialog, {data: {
            title: "Voulez-vous vraiment supprimé cette ami(e) ?"}
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

    searchFriend() {
        this.pageIndex = 0;
        this.input = this.searchFriend$.getValue().toLowerCase();

        this.displayFriends = [];
        this.displayFriends = this.friends
            .filter(friend => friend.name.toLowerCase().indexOf(this.searchFriend$.getValue().toLowerCase()) != -1);

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

    scrollSearch() {
        ++this.pageIndex;
        let tmp = this.displayFriends;
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