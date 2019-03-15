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

@Component({
    selector: 'group-list',
    templateUrl: 'group_list.html',
    styleUrls: ['group_list.scss', '../../../../scss/themes/main.scss']
})
export class GroupListComponent implements OnInit {

    userGroups: any[];

    private user: ElementRef;

    @ViewChild('user') set content(user: ElementRef) {
        this.user = user;
    }

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
        this.user.nativeElement.className += ' group-focused';
        setTimeout(() => this.user.nativeElement.focus(), 0);
    }

    getGroups() {
        this.profileSrv.userProfile$.subscribe(user => {
            this.requestSrv.get(`users/${user.pseudo}/groups`, {}, {Authorization: ''})
                .subscribe(groups => {
                    this.userGroups = groups.groups;
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
}
