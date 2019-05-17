import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { Friends } from '../../core/models/Friends';
import { User } from '../../core/models/User';
import {ProfileService} from '../../core/services/profile.service';
import {Router} from "@angular/router";
import {RequestService} from "../../core/services/request.service";


@Component({
    selector: 'FriendsComponent',
    templateUrl: 'friends.html',
    styleUrls: ['friends.scss']
})
export class FriendsComponent implements AfterViewInit {
    user : User;
    request_scroll_pos_prev: number;
    list_scroll_pos_prev: number;

    @ViewChild('Requests') request;
    @ViewChild('Request_Component') request_component;

    @ViewChild('List') list;
    @ViewChild('List_Component') list_component;

    friends: Friends[] = [
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

    constructor() {

	}

    ngAfterViewInit() {
        if (this.list && this.request) {
            this.request_scroll_pos_prev = this.request.nativeElement.scrollTop;
            this.list_scroll_pos_prev = this.list.nativeElement.scrollTop;
        }
    }

    scrolling(type: string, event) {
        let height = this[`${type}`].nativeElement.scrollHeight;
        let pos = this[`${type}`].nativeElement.scrollTop;
        let end = this[`${type}`].nativeElement.offsetHeight;
        let self = this;

        setTimeout(function () {
            if (self[`${type}_scroll_pos_prev`] < pos) {
                if (height - pos === end) {
                    self[`${type}_component`].scrollSearch();
                }
            }
            self[`${type}_scroll_pos_prev`] = pos;
        }, 500);
    }
}
