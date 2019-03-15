import {
    AfterContentInit,
    AfterViewInit,
    Component, EventEmitter,
    Input,
    OnChanges,
    OnInit, Output,
    SimpleChange,
    SimpleChanges
} from "@angular/core";
import {RequestService} from "../../../core/services/request.service";
import {Group} from "../../../core/models/Group";
import {ToastrService} from "ngx-toastr";
import {ProfileService} from "../../../core/services/profile.service";
import {MatDialog} from "@angular/material";
import {GroupCreationDialog} from "../../../module/dialog/Group-creation-dialog/group-creation";
import {ChangeValueDialog} from "../../../module/dialog/Change -value/change-value";

@Component({
    selector: 'group-info',
    templateUrl: "group_info.html",
    styleUrls: ['group_info.scss', '../../../../scss/themes/main.scss']
})
export class GroupInfoComponent implements OnInit, OnChanges {

    ready: boolean = false;

    @Input("group_id") group_id: number = null;

    @Output("group_modified") group_modified = new EventEmitter<number>();

    user: any = {
        pseudo: '',
        description: '',
        email: ''
    };

    group: Group = {
        name: '',
        description: ''
    };

    user$ = this.profileSrv.userProfile$;

    image = null;

    display_members: any[] = [];

    user_role: string;

    modify: boolean = false;

    group_members = [];

    group_owner: null;

    roles: string[] = [
        "Admin",
        "Spectator"
    ];

    new_members: string[] = [];

    new_member: string = '';

    new_group_name: string;

    constructor(private requestSrv: RequestService,
                private profileSrv: ProfileService,
                private dialog: MatDialog,
                private toastSrv: ToastrService) {

    }

    ngOnInit() {
        this.getInformationData();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.group_id = changes.group_id.currentValue;
        this.getInformationData();
    }

    getInformationData() {
        this.ready = false;
        if (this.group_id === -1) {
            this.user$.subscribe(user => {
                this.user.pseudo = user.pseudo;
                this.user.email = user.email;
                this.user.description = "Regroupement de tous vos évènements";
                this.requestSrv.get(`users/${user.pseudo}/image`, {}, {Authorization: ''})
                    .subscribe(ret => {
                        this.image = ret.image;
                        this.ready = true;
                    });
            })
        }
        else {
            this.requestSrv.get(`groups/${this.group_id}`, {}, {Authorization: ""})
                .subscribe(ret => {
                    this.group.name = ret.group.name;
                    this.group.description =
                        (ret.group.description == "" || !ret.group.description) ? "Pas de description" : ret.group.description;
                    this.requestSrv.get(`groups/${ret.group.id}/image`, {}, {Authorization: ''})
                        .subscribe(ret => {
                            this.image = ret.image;
                            this.ready = true;
                        });
                });
        }
    }

    changeUser(value: string, fieldname: string) {
        this.user$.subscribe(user => {
            let dialogRef = this.dialog.open(ChangeValueDialog, {
                data: {fieldname: fieldname, value: value}
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result != null && result.value != user[`${fieldname}`]) {
                    let user_pseudo = user.pseudo;
                    user[`${fieldname}`] = result.value;
                    this.requestSrv.put(`users/${user_pseudo}`, {
                        pseudo: user.pseudo,
                        email: user.email
                    }, {Authorization: ''})
                        .subscribe(ret => {
                            user[`${fieldname}`] = ret.user[`${fieldname}`];
                            this.user[`${fieldname}`] = ret.user[`${fieldname}`];
                            this.toastSrv.success(`Votre ${fieldname} a bien été modifié`);
                        });
                }
            });
        });
    }

    changeGroupBasicInfo(value: string, fieldname: string) {
        let dialogRef = this.dialog.open(ChangeValueDialog, {
            data: {fieldname: fieldname, value: value}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result != null && result.value != this.group[`${fieldname}`]) {
                this.group[`${fieldname}`] = result.value;
                this.requestSrv.put(`groups/${this.group_id}`, {
                    name: this.group.name,
                    description: this.group.description
                }, {Authorization: ''})
                    .subscribe(ret => {
                        this.group[`${fieldname}`] = ret.group[`${fieldname}`];
                        if (fieldname === 'name') {
                            this.group_modified.emit(ret.group.id);
                        }
                        this.toastSrv.success(`Le ${fieldname} de ce groupe a bien été modifié`);
                    })
            }
        })
    }
}
