import {AfterViewInit, Component, OnInit} from "@angular/core";
import {RequestService} from "../../../core/services/request.service";
import {Router} from "@angular/router";
import {ProfileService} from "../../../core/services/profile.service";
import {BehaviorSubject, Observable} from "rxjs/Rx";
import {MatDialog} from "@angular/material";
import {Friends} from "../../../core/models/Friends";
import {User} from "../../../core/models/User";
import {ConfirmDialog} from "../../../module/dialog/Confirm-dialog/Confirm-dialog";

@Component({
    selector: 'friend-list',
    templateUrl: 'friend-list.html',
    styleUrls: ['friend-list.scss', '../../../../scss/themes/main.scss']
})
export class FriendListComponent implements OnInit, AfterViewInit {
    user: User;

    start: boolean = true;

    public search$ = new BehaviorSubject<string>('');

    ready$: Observable<boolean>;

    ready: BehaviorSubject<boolean>;

    pageSize: number = 15;

    pageIndex: number = 0;

    sortingBy: string = "name";

    displayFriends: any[];

    input: any;

    friends: Friends[] = [
        {name: 'max', image: 'assets/Pictures/bread.jpg'},
        {name: 'Julius Gaius César', image: 'assets/Pictures/bread.jpg'},
        {name: 'Hannibal', image: 'assets/Pictures/bread.jpg'},
        {name: 'Publius Cornelius Scipio Africanus', image: 'assets/Pictures/bread.jpg'},
        {name: 'Arthur Pendragon', image: 'assets/Pictures/bread.jpg'},
        {name: 'Cú Chulainn', image: 'assets/Pictures/bread.jpg'},
        {name: 'Oda Nobunaga', image: 'assets/Pictures/bread.jpg'},
        {name: 'Le Général Pépin', image: 'assets/Pictures/bread.jpg'},
        {name: 'Le Général Franco', image: 'assets/Pictures/bread.jpg'},
        {name: 'Stalin', image: 'assets/Pictures/bread.jpg'},
        {name: 'Mao Tse-Tung', image: 'assets/Pictures/bread.jpg'},
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
        this.getFriends();
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

    getFriends() {
        // this.requestSrv.get(`userrelationships`, {
        //     _limit: this.pageSize,
        //     _start: this.pageIndex,
        //     _sort:  this.sortingBy,
        //     _contains:    this.search$.getValue().toLowerCase()
        // }, {Authorization: ''})
        //     .subscribe(ret => {
        //         ret.relations.forEach(friend => this.displayRequests.push(frend));
        //         this.ready.next(true);
        //     }, err => {
        //         this.toastSrv.error(err.error.message, 'Une erreur est survenue');
        //     });
    }

    goToUserProfil(friend) {
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

    search() {
        console.log('\nSearch by input value');
        this.pageIndex = 0;
        this.input = this.search$.getValue().toLowerCase();

        this.displayFriends = [];
        this.displayFriends = this.friends
            .filter(friend => friend.name.toLowerCase().indexOf(this.search$.getValue().toLowerCase()) != -1);

        console.log("Number of friends returned per request => ", this.pageSize);
        console.log("Starting at friend => ", this.pageIndex, " * ", this.pageSize);
        console.log("Sorting friends by => ", this.sortingBy);
        console.log("Searching friend for value => ", this.search$.getValue().toLowerCase());


        /* To be implemented when the routes will be up api wise*/

        // this.displayFriends = [];
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
        console.log("Number of friends returned per request => ", this.pageSize);
        console.log("Starting at friend => ", this.pageIndex, " * ", this.pageSize);
        console.log("Sorting friends by => ", this.sortingBy);
        console.log("Searching friend for value => ", this.search$.getValue().toLowerCase());

        let tmp = this.displayFriends;
        tmp.forEach(group => this.displayFriends.push(group));

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