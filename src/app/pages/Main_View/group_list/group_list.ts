import {
    AfterContentInit,
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter, HostListener,
    OnInit,
    Output,
    QueryList,
    ViewChild,
    ViewChildren
} from "@angular/core";
import {RequestService} from "../../../core/services/request.service";
import {ToastrService} from "ngx-toastr";
import {ProfileService} from "../../../core/services/profile.service";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material";
import {GroupCreationDialog} from "../../../module/dialog/Group-creation-dialog/group-creation";
import {BehaviorSubject, Observable} from "rxjs/Rx";
import {UsersService} from "../../../core/services/Requests/Users";
import {GroupsService} from "../../../core/services/Requests/Groups";

@Component({
    selector: 'group-list',
    templateUrl: 'group_list.html',
    styleUrls: ['group_list.scss', '../../../../scss/themes/main.scss']
})
export class GroupListComponent implements OnInit, AfterViewInit {

    start: boolean = true;

    userGroups: any[] = [];

    displayGroups: any[] = [];

    public search$ = new BehaviorSubject<string>('');

    private user: ElementRef;

    ready$: Observable<boolean>;

    ready: BehaviorSubject<boolean>;

    displayUser: boolean = true;

    pageSize: number = 15;

    pageIndex: number = 0;

    sortingBy: string = "name";

    input: any;

    @ViewChild('user') set content(user: ElementRef) {
        this.user = user;
    }

    userImage = null;

    @ViewChildren('groups') groups: QueryList<ElementRef>;

    @Output() group_clicked = new EventEmitter<number>();

    constructor(private requestSrv: RequestService,
                private profileSrv: ProfileService,
                private usersSrv: UsersService,
                private groupsSrv: GroupsService,
                private toastSrv: ToastrService,
                private dialog: MatDialog,
                private router: Router) {
        this.ready = new BehaviorSubject<boolean>(false);
        this.ready$ = this.ready.asObservable();
    }

    ngOnInit() {
        this.getGroups();
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
                    let self = this;
                    setTimeout(function () {
                        self.user.nativeElement.className += ' group-focused';
                        self.user.nativeElement.focus();
                    }, 10);
                }
            })
            .subscribe();
    }

    getGroups() {
        this.profileSrv.userProfile$.subscribe(user => {
            this.usersSrv.getImage(user.pseudo)
                .subscribe(ret => this.userImage = ret.image);
            this.usersSrv.getGroups(user.pseudo)
                .subscribe(groups => {
                    if (groups.groups.length > 0) {
                        this.userGroups = groups.groups;
                        this.userGroups.forEach((group, index) => {
                            this.groupsSrv.getImage(group.id)
                                .subscribe(ret => {
                                    group['image'] = ret.image;
                                    if (index === this.userGroups.length - 1)
                                        this.ready.next(true);
                                });
                        });
                        this.displayGroups = this.userGroups;
                    }
                    else this.ready.next(true);
                })
        });
    }

    formatBody(body) {
        console.log('body => ', body);
        let field = 'members';
        let found: boolean = false;
        let end = '"role":"actor"}';
        let str = 'members": [';
        for (let key in body) {
            if (key.toString().indexOf(field) != -1) {
                found = true;
                str += JSON.stringify(body[key]) + ',';
            }
        }
        str = str.slice(0, str.length - 1);
        str += ']';
        let result = JSON.stringify(body);
        return found === true ? (result.substring(0, result.indexOf('members[0]')) + str + result.substring(result.lastIndexOf(end) + end.length)) : result;
    }

    createGroup() {
        let dialogRef = this.dialog.open(GroupCreationDialog, {});

        dialogRef.afterClosed().subscribe(result => {
            if (result !== null && result !== undefined) {
                this.groupsSrv.createGroup(this.formatBody(result))
                .subscribe(ret => {
                        (<any>window).ga('send', 'event', 'Group', 'Creating Group', `Group Name: ${result.name}`);
                        this.toastSrv.success(`Votre groupe ${ret.group.name} a bien été créé`);
                        this.ready.next(false);
                        this.getGroups();
                    },
                    err => {
                        this.toastSrv.error(err.error.message, 'Une erreur est survenue'); // Display an error message if an error occurs
                    });
            }
        })
    }

    private removeClass(element, className: string) {
        let cn = element.className;
        let rxp = new RegExp("(" + className + ")", "g");
        cn = cn.replace(rxp, '');
        element.className = cn;
    }

    sendGroup(group_id: number, pos_id: number) {
        let groups = this.groups.toArray();

        this.group_clicked.emit(group_id);
        this.removeClass(this.user.nativeElement, 'group-focused');
        groups.forEach(group => {
            this.removeClass(group.nativeElement, 'group-focused');
        });
        if (pos_id === -1) {
            (<any>window).ga('send', 'event', 'Group', 'Checking myself', `User Pseudo: ${this.profileSrv.user.pseudo}`);
            this.user.nativeElement.className += ' group-focused';
        }
        else {
            (<any>window).ga('send', 'event', 'Group', 'Checking group', `Checking Group: "${this.displayGroups[pos_id].name}"`);
            groups[pos_id].nativeElement.className += ' group-focused';
        }
    }

    search() {
        this.input = this.search$.getValue().toLowerCase();
        this.pageIndex = 0;

        this.displayGroups = [];
        this.displayGroups = this.userGroups
            .filter(group => group.name.toLowerCase().indexOf(this.search$.getValue().toLowerCase()) != -1);
        this.profileSrv.userProfile$.subscribe(user => {
            user.pseudo.toLowerCase().indexOf(this.search$.getValue().toLowerCase()) !== -1 ? this.displayUser = true : this.displayUser = false;
        });

        /* To be implemented when the routes will be up api wise*/

    }

    scrollGroupSearch() {
        ++this.pageIndex;

        let tmp = this.displayGroups;

        /* To be implemented when the routes will be up api wise*/
    }

    modifyGroupName(group_id: number) {
        this.groupsSrv.getGroup(group_id)
            .subscribe(ret => {
                (this.userGroups.find(group => group.id === group_id)).name = ret.group.name;
            })
    }

    leftGroup(group_id: number) {
        this.ready.next(false);
        this.getGroups();
    }
}
