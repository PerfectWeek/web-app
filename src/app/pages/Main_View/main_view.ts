import {Component, Input, OnInit, ViewChild, HostListener, AfterViewInit} from "@angular/core";
import {RequestService} from "../../core/services/request.service";
import {GroupsService} from "../../core/services/Requests/Groups";

@Component({
    selector: "main-view",
    templateUrl: 'main_view.html',
    styleUrls: ['main_view.scss', '../../../scss/themes/main.scss']
})
export class MainViewComponent implements OnInit, AfterViewInit {

    @ViewChild('group_list') group_list;
    @ViewChild('left_view') left_view;

    scroll_pos_prev: number;

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

    constructor(private requestSrv: RequestService,
                private groupsSrv: GroupsService) {

    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        this.scroll_pos_prev = this.left_view.nativeElement.scrollTop;
    }

    goToGroup(group_id) {
        this.group_id = group_id;
        if (group_id != -1)
            this.groupsSrv.getGroup(group_id)
                .subscribe(ret => this.calendar_id = ret.group.calendar_id);
        else {
            this.calendar_id = group_id;
        }
    }

    modifyGroupName(group_id) {
        this.group_list.modifyGroupName(group_id);
    }

    GroupModification(group_id) {
        this.group_list.getGroups();
        this.group_list.ready.next(false);
        this.group_list.user.nativeElement.click();
    }

    imageModification(group_id) {
        this.group_list.getGroups();
        this.group_list.ready.next(false);
    }

    scrolling(event) {
        let height = this.left_view.nativeElement.scrollHeight;
        let pos = this.left_view.nativeElement.scrollTop;
        let end = this.left_view.nativeElement.offsetHeight;
        let self = this;

        setTimeout(function () {
            if (self.scroll_pos_prev < pos) {
                if (height - pos === end) {
                    self.group_list.scrollGroupSearch();
                }
            }
            self.scroll_pos_prev = pos;
        }, 500);
    }
}