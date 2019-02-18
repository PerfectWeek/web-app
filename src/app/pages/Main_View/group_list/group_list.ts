import {Component, OnInit, ViewChild} from "@angular/core";
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

    constructor(private requestSrv: RequestService,
                private profileSrv: ProfileService,
                private toastSrv: ToastrService,
                private dialog: MatDialog,
                private router: Router) {

    }

    ngOnInit() {
        this.profileSrv.userProfile$.subscribe(user => {
            this.requestSrv.get(`users/${user.pseudo}/groups`, {}, {Authorization: ''})
                .subscribe(groups => {
                    this.userGroups = groups.groups;
                    console.log('groups => ', groups.groups);
                })
        });
    }

    createGroup() {
        let dialogRef = this.dialog.open(GroupCreationDialog, {});

        dialogRef.afterClosed().subscribe(result => {
            if (result !== null && result !== undefined) {
                this.router.navigate([`/group/${result}`]);
            }
        })
    }

    // goToCalendar(group) {
    //     // console.log("GROUPE ", group);
    //     this.requestSrv.get(`groups/${group.id}`, {}, {Authorization: ''})
    //         .subscribe(ret => {
    //             // console.log("THE OBJECT ",ret);
    //             // console.log("TA MERDE LA PUTE ", ret.calendar.id);
    //             this.router.navigate([`calendar/${ret.group.calendar_id}`]);
    //         });
    // }
    // goToGroup(group, event) {
    //     if (event.target.classList[1] !== 'fa-calendar-alt')
    //         this.router.navigate([`group/${group.id}`]);
    // }
}
