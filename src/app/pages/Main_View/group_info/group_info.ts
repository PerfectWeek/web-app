import {Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges} from "@angular/core";
import {RequestService} from "../../../core/services/request.service";
import {Group} from "../../../core/models/Group";
import {ToastrService} from "ngx-toastr";
import {ProfileService} from "../../../core/services/profile.service";

@Component({
    selector: 'group-info',
    templateUrl: "group_info.html",
    styleUrls: ['group_info.scss', '../../../../scss/themes/main.scss']
})
export class GroupInfoComponent implements OnInit, OnChanges {

    @Input("group_id") group_id: number = null;

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
        if (this.group_id === -1) {
            this.user$.subscribe(user => {
                this.group.name = user.pseudo;
                this.group.description = "Regroupement de tous vos évènements";
                this.requestSrv.get(`users/${user.pseudo}/image`, {}, {Authorization: ''})
                    .subscribe(ret => this.image = ret.image);
            })
        }
        else {
            this.requestSrv.get(`groups/${this.group_id}`, {}, {Authorization: ""})
                .subscribe(ret => {
                    this.group.name = ret.group.name;
                    this.group.description =
                        (ret.group.description == "" || !ret.group.description) ? "Pas de description" : ret.group.description;
                    this.requestSrv.get(`groups/${ret.group.id}/image`, {}, {Authorization: ''})
                        .subscribe(ret => this.image = ret.image);
                });
        }
    }
}