import {AfterViewInit, Component, ElementRef, Inject, ViewChild} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl} from "@angular/forms";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {ToastrService} from "ngx-toastr";
import {ProfileService} from "../../../core/services/profile.service";
import {RequestService} from "../../../core/services/request.service";
import {Router} from "@angular/router";
import {BehaviorSubject, Observable} from "rxjs/Rx";
import {User} from "../../../core/models/User";
import {MatAutocomplete} from "@angular/material";
import {startWith} from "rxjs/internal/operators";

@Component({
    selector: 'friend-invitation-dialog',
    templateUrl: 'invitation.html',
    styles: ['.mat-raised-button {\n' +
    '  box-sizing: border-box;\n' +
    '  position: relative;\n' +
    '  -webkit-user-select: none;\n' +
    '  -moz-user-select: none;\n' +
    '  -ms-user-select: none;\n' +
    '  user-select: none;\n' +
    '  cursor: pointer;\n' +
    '  outline: 0;\n' +
    '  border: none;\n' +
    '  -webkit-tap-highlight-color: transparent;\n' +
    '  display: inline-block;\n' +
    '  white-space: nowrap;\n' +
    '  text-decoration: none;\n' +
    '  vertical-align: baseline;\n' +
    '  text-align: center;\n' +
    '  margin: 0;\n' +
    '  min-width: 88px;\n' +
    '  line-height: 36px;\n' +
    '  padding: 0 16px;\n' +
    '  border-radius: 2px;\n' +
    '  overflow: visible;\n' +
    '  transform: translate3d(0, 0, 0);\n' +
    '  transition: background .4s cubic-bezier(.25, .8, .25, 1), box-shadow 280ms cubic-bezier(.4, 0, .2, 1);\n' +
    '  box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);\n' +
    '}']
})
export class FriendInvitationDialog implements AfterViewInit {

    pageIndex: number = 0;
    pageSize: number = 10;
    sortingBy: string = "pseudo";

    selectable: boolean = true;
    removable: boolean = true;
    visible: boolean = true;
    addOnBlur: boolean = false;
    separatorKeysCodes: number[] = [ENTER, COMMA];

    user: any = null;
    selectedUsers: string[] = [];
    userCtrl: FormControl = new FormControl();

    filteredUsers: BehaviorSubject<User[]>;
    filteredUsers$: Observable<User[]>;

    @ViewChild('users') users: MatAutocomplete;

    public search$ = new BehaviorSubject<string>('');

    constructor(private requestSrv: RequestService,
                private profileSrv: ProfileService,
                private toastSrv: ToastrService,
                private router: Router,
                public dialogRef: MatDialogRef<FriendInvitationDialog>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.filteredUsers = new BehaviorSubject<User[]>([]);
        this.filteredUsers$ = this.filteredUsers.asObservable();
    }



    ngAfterViewInit() {
        this.search$
            .debounceTime(300)
            .distinctUntilChanged()
            .do(() => this.search())
            .subscribe();
    }

    addUser(event) {
        const input = event.input;
        const value = event.value;
        this.requestSrv.get(`users/${value}`, {}, {Authorization: ''})
            .subscribe(ret => {
                    let id: number = -1;
                    this.selectedUsers.forEach((atm_user, index) => {
                        if (atm_user === value)
                            id = index;
                    });
                    if (id != -1)
                        this.selectedUsers.splice(id, 1);
                    else
                        this.selectedUsers.push(value);
                },
                err => {
                    this.toastSrv.error(err.message, 'Une erreur est survenue')
                });
        input.value = '';
    }


    search() {
        console.log("\nNumber of users returned per request => ", this.pageSize);
        console.log("Starting at matching user => ", this.pageIndex, " * ", this.pageSize);
        console.log("Sorting users by => ", this.sortingBy);
        console.log("Searching users for value => ", this.search$.getValue().toLowerCase());

        this.filteredUsers.next([]);
        this.profileSrv.userProfile$.subscribe(currentUser => {
            if (currentUser.pseudo.toLowerCase().indexOf(this.search$.getValue().toLowerCase()) !== -1) {
                this.filterCurrentUser(currentUser);
            }
        });


        /* To be implemented when the routes will be up api wise*/

        // this.requestSrv.get(`users`, {
        //     _limit: this.pageSize,
        //     _start: this.pageIndex,
        //     _sort:  this.sortingBy,
        //     _contains:    this.search$.getValue().toLowerCase()
        // }, {Authorization: ''})
        //     .subscribe(ret => {
        //         this.filterUsers(ret.users);
        //     }, err => {
        //         this.toastSrv.error(err.error.message, 'Une erreur est survenue');
        //     });
    }

    filterUsers(users) {
        for (let user of users) {
            let is_in: boolean = false;

            for (let selected of this.selectedUsers)
                if (user.pseudo === selected) {
                    is_in = true;
                    break;
                }

            if (is_in === true)
                break;

            let users = this.filteredUsers.getValue();
            users.push(user);
            this.filteredUsers.next(users);
        }
    }

    filterCurrentUser(currentUser) {
        for (let user of this.selectedUsers)
            if (currentUser.pseudo === user)
                return;

        let users = this.filteredUsers.getValue();
        users.push(currentUser);
        this.filteredUsers.next(users);
    }

    // Add the selected user to the list of selected users and reset the input search value
    selected(event) {
        this.selectedUsers.push(event.option.viewValue);
        let input = (<any>(document.getElementById('UserInput'))).value = ''; // value exists as we are getting an input
        this.userCtrl.setValue(null);
    }

    removeUser(user) {
        const index = this.selectedUsers.indexOf(user); // Getting the index of the user we want to remove

        if (index >= 0)
            this.selectedUsers.splice(index, 1); // Removing the user from our array of selected users
    }

    sendInvitations() {
        this.profileSrv.userProfile$.subscribe(user => {
            let id = -1;
            this.selectedUsers.forEach((pseudo, index) => {
                if (pseudo === user.pseudo)
                    id = index;
            });

            if (id === -1)
                this.selectedUsers.push(user.pseudo);

            // Setting the request body attributes and values
            let body = {};
            this.selectedUsers.forEach((user, index) => {
                body[`users[${index}]`] = user;
            });

            return false;

            //     this.requestSrv.post('userrelationship/invite', body, {Authorization: ''}).subscribe(ret => {
            //             this.toastSrv.success(`Invitations envoyées`);
            //             this.dialogRef.close();
            //             return true;
            //         },
            //         err => {
            //             this.toastSrv.error(err.error.message, 'Une erreur est survenue'); // Display an error message if an error occurs
            //             return false;
            //         });
            // }, (error) => {console.log('error => ', error)});
        })
    }
}
