import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
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
import {BehaviorSubject} from "rxjs/Rx";

@Component({
    selector: 'group-list',
    templateUrl: 'group_list.html',
    styleUrls: ['group_list.scss', '../../../../scss/themes/main.scss']
})
export class GroupListComponent implements OnInit, AfterViewInit {

    userGroups: any[] = [];

    displayGroups: any[] = [];

    public search$ = new BehaviorSubject<string>('');

    private user: ElementRef;

    @ViewChild('user') set content(user: ElementRef) {
        this.user = user;
    }

    userImage = null;

    @ViewChildren('groups') groups: QueryList<ElementRef>;

    @Output() group_clicked = new EventEmitter<number>();

    constructor(private requestSrv: RequestService,
                private profileSrv: ProfileService,
                private toastSrv: ToastrService,
                private dialog: MatDialog,
                private router: Router) {

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

        this.user.nativeElement.className += ' group-focused';
        setTimeout(() => this.user.nativeElement.focus(), 0);
    }

    getGroups() {
        this.profileSrv.userProfile$.subscribe(user => {
            this.requestSrv.get(`users/${user.pseudo}/image`, {}, {Authorization: ''})
                .subscribe(ret => this.userImage = ret.image);
            this.requestSrv.get(`users/${user.pseudo}/groups`, {}, {Authorization: ''})
                .subscribe(groups => {
                    this.userGroups = groups.groups;
                    this.userGroups.forEach(group => {
                        this.requestSrv.get(`groups/${group.id}/image`, {}, {Authorization: ""})
                            .subscribe(ret => group['image'] = ret.image);
                    });
                    this.displayGroups = this.userGroups;
                })
        });
    }

    createGroup() {
        let dialogRef = this.dialog.open(GroupCreationDialog, {});

        dialogRef.afterClosed().subscribe(result => {
            if (result !== null && result !== undefined) {
                this.getGroups();
            }
        })
    }

    private removeClass(element, className: string) {
        let cn = element.className;
        let rxp = new RegExp( "("+className+")", "g" );
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
        if (pos_id === -1)
            this.user.nativeElement.className += ' group-focused';
        else {
            groups[pos_id].nativeElement.className += ' group-focused';
        }
    }

    search() {
        this.displayGroups = this.userGroups
            .filter(group => group.name.toLowerCase().indexOf(this.search$.getValue().toLowerCase()) != -1);
    }
}
