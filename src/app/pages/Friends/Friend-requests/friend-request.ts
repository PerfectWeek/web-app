import {AfterViewInit, Component, OnInit} from "@angular/core";
import {RequestService} from "../../../core/services/request.service";
import {User} from "../../../core/models/User";
import {Router} from "@angular/router";
import {Friends} from "../../../core/models/Friends";
import {ProfileService} from "../../../core/services/profile.service";
import {BehaviorSubject, Observable} from "rxjs/Rx";
import {MatDialog, MatDialogRef} from "@angular/material";
import {FriendInvitationDialog} from "../../../module/dialog/Friend-Invitation/invitation";
import {ConfirmDialog} from "../../../module/dialog/Confirm-dialog/Confirm-dialog";

@Component({
    selector: 'friend-requests',
    templateUrl: 'friend-request.html',
    styleUrls: ['friend-request.scss', '../../../../scss/themes/main.scss']
})
export class FriendRequestComponent implements OnInit, AfterViewInit {
    user : User;

    start: boolean = true;

    public search$ = new BehaviorSubject<string>('');

    ready$: Observable<boolean>;

    ready: BehaviorSubject<boolean>;

    pageSize: number = 15;

    pageIndex: number = 0;

    sortingBy: string = "name";

    displayRequests: any[];

    input: any;

    friendRequests: any[] = [
        {name: 'max', image: 'assets/Pictures/bread.jpg', id: 0},
        {name: 'Emmanuel Macron', image: 'assets/Pictures/bread.jpg', id: 1},
        {name: 'Michel Sardou', image: 'assets/Pictures/bread.jpg', id: 2},
        {name: 'Jacquie', image: 'assets/Pictures/bread.jpg', id: 3},
        {name: 'Michelle', image: 'assets/Pictures/bread.jpg', id: 4},
        {name: 'Tonton Gaston', image: 'assets/Pictures/bread.jpg', id: 5},
    ];

    constructor(private profileSrv: ProfileService,
                private requestSrv: RequestService,
                private router: Router,
                private dialog: MatDialog) {
        this.ready = new BehaviorSubject<boolean>(false);
        this.ready$ = this.ready.asObservable();
    }

    ngOnInit() {
        this.profileSrv.userProfile$.subscribe(user => {
            this.user = user;
        }, (error) => {console.log('error => ', error)});
        this.getRequests();
        this.ready.next(true);
    }

    ngAfterViewInit() {
        this.search$
            .debounceTime(300)
            .distinctUntilChanged()
            .do(() => this.search())
            .subscribe();

        this.ready$
            .do((value) => {
                if (value === true && this.start === true) {
                    this.start = false;
                }
            })
            .subscribe();
    }

    getRequests() {
        // this.requestSrv.get(`userrelationships`, {
        //     _limit: this.pageSize,
        //     _start: this.pageIndex,
        //     _sort:  this.sortingBy,
        //     _contains:    this.search$.getValue().toLowerCase()
        // }, {Authorization: ''})
        //     .subscribe(ret => {
        //         ret.relations.forEach(requests => this.displayRequests.push(request));
        //         this.ready.next(true);
        //     }, err => {
        //         this.toastSrv.error(err.error.message, 'Une erreur est survenue');
        //     });
    }

    createInvitation() {
        let dialogRef = this.dialog.open(FriendInvitationDialog, {});
    }

    goToUserProfil(friend) {
        this.router.navigate(["profile", friend.name]);
    }

    acceptRequest(request, index) {
        // this.requestSrv.post('userrelationships', {
        // 	response: true,
        // 	request: request.id
        // }, Authorization: '').subscribe(ret => {
        // 	console.log('Accept request ret => ', ret);
        // 	this.friendRequests.splice(index, 1);
        // });

        this.friendRequests.splice(index, 1);
    }

    declineRequest(request, index) {
       // this.requestSrv.post('userrelationships', {
       // 	response: false,
       // 	request: request.id
       // }, Authorization: '').subscribe(ret => {
       // 	console.log('Accept request ret => ', ret);
       // 	this.friendRequests.splice(index, 1);
       // });
       this.friendRequests.splice(index, 1);
    }

    search() {
        console.log('\nSearch by input value');
        this.pageIndex = 0;
        this.input = this.search$.getValue().toLowerCase();

        this.displayRequests = [];
        this.displayRequests = this.friendRequests
            .filter(group => group.name.toLowerCase().indexOf(this.search$.getValue().toLowerCase()) != -1);

        console.log("Number of requests returned per request => ", this.pageSize);
        console.log("Starting at request => ", this.pageIndex, " * ", this.pageSize);
        console.log("Sorting requests by => ", this.sortingBy);
        console.log("Searching requests for value => ", this.search$.getValue().toLowerCase());


        /* To be implemented when the routes will be up api wise*/

        // this.displayGroups = [];
        // this.requestSrv.get(`userrelationships`, {
        //     _limit: this.pageSize,
        //     _start: this.pageIndex,
        //     _sort:  this.sortingBy,
        //     "=":    this.search$.getValue().toLowerCase()
        // }, {Authorization: ''})
        //     .subscribe(ret => {
        // console.log('ret => ', ret);
        //         ret.relations.forEach(request => this.displayRequests.push(request));
        //     }, err => {
        //         this.toastSrv.error(err.error.message, 'Une erreur est survenue');
        //     });

    }

    scrollSearch() {
        console.log('\nAfter Scroll Search');
        ++this.pageIndex;
        console.log("Number of requests returned per request => ", this.pageSize);
        console.log("Starting at request => ", this.pageIndex, " * ", this.pageSize);
        console.log("Sorting requests by => ", this.sortingBy);
        console.log("Searching requests for value => ", this.search$.getValue().toLowerCase());

        let tmp = this.displayRequests;
        tmp.forEach(request => this.displayRequests.push(request));

        /* To be implemented when the routes will be up api wise*/

        // this.requestSrv.get(`userrelationships`, {
        //     _limit: this.pageSize,
        //     _start: this.pageIndex,
        //     _sort:  this.sortingBy,
        //     _contains:    this.search$.getValue().toLowerCase()
        // }, {Authorization: ''})
        //     .subscribe(ret => {
        //         ret.relations.forEach(requests => this.displayRequests.push(request));
        //     }, err => {
        //         this.toastSrv.error(err.error.message, 'Une erreur est survenue');
        //     });
    }
}