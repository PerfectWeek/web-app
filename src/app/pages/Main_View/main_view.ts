import {Component, Input, OnInit, ViewChild} from "@angular/core";
import {RequestService} from "../../core/services/request.service";

@Component({
    selector: "main-view",
    templateUrl: 'main_view.html',
    styleUrls: ['main_view.scss', '../../../scss/themes/main.scss']
})
export class MainViewComponent implements OnInit {

    @ViewChild('group_list') group_list;

    private _group_id: number = -1;
    private _calendar_id: number = -1;

    get group_id() {
        return this._group_id;
    }

    set group_id(id: number) {
        this._group_id = id;
    }

    get calendar_id() {
        return this._calendar_id;
    }

    set calendar_id(id: number) {
        this._calendar_id = id;
    }

    constructor(private requestSrv: RequestService) {

    }

    ngOnInit() {

    }

    goToGroup(group_id) {
        this.group_id = group_id;
        if (group_id != -1)
            this.requestSrv.get(`groups/${group_id}`, {}, {Authorization: ''})
                .subscribe(ret => this.calendar_id = ret.group.calendar_id);
        else {
            this.calendar_id = group_id;
        }
    }

    modifyGroupName(event) {
        console.log('event => ', event);
        this.group_list.modifyGroupName(event);
    }
}