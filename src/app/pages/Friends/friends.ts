import { Component, OnInit } from '@angular/core';
import { Friends } from '../../core/models/Friends';
import { User } from '../../core/models/User';
import {ProfileService} from '../../core/services/profile.service';


@Component({
    selector: 'FriendsComponent',
    templateUrl: 'friends.html',
    styleUrls: ['friends.scss']
})
export class FriendsComponent {
    user : User;
    
    friends: Friends[] = [
	{ name: 'Winston DuPuy'},
	{ name: 'Damien-de tres tres loi au bout du monde' },
	{ name: 'Mehdi Bento'},
	{ name: 'Henry Salvador'},
	{ name: 'Seb'},
    ];

    x: Friends = {name: "Christian"};
    constructor(private profileSrv: ProfileService) {
	
    }

    ngOnInit() {
	this.profileSrv.userProfile$.subscribe(user => {
	    this.user = user;
	}, (error) => {console.log('error => ', error)});
    }
    
    deleteFriend(fr: Friends) {
	//const index: number = this.friends.indexOf(fr);
	//console.log("INDEX : " + index);
	this.friends = this.friends.filter(item => item !== fr);
	console.log("function deleteFriend called ici");
    }

    addFriend() {
	this.friends.push(this.x);
	console.log("function addFriend called");
    }
}
