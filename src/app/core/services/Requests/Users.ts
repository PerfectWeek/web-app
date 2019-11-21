import {Injectable} from "@angular/core";
import {RequestService} from "../request.service";
import {Observable} from "rxjs/Rx";

@Injectable()
export class UsersService {

    constructor(private requestSrv: RequestService) {
    }

    // createUser(user): Observable<any> {
    //     return this.requestSrv.post('users', user);
    // }

    putTimezone(): Observable<any> {
        return this.requestSrv.put(`users/me/timezone`, {
            timezone: new Date().getTimezoneOffset()
        }, {Authorization: ''});
    }

    getMe(): Observable<any> {
        return this.requestSrv.get(`users/me`, {}, {Authorization: ''});
    }

    getUser(user_id: number): Observable<any> {
        return this.requestSrv.get(`users/${user_id}`, {}, {Authorization: ''});
    }

    modifyUser(body: any): Observable<any> {
        return this.requestSrv.put(`users/me`, body, {Authorization: ''});
    }

    deleteUser(): Observable<any> {
        return this.requestSrv.delete(`users/me`, {Authorization: ''});
    }

    linkFacebook(pseudo: string, body: any): Observable<any> {
        return this.requestSrv.put(`users/${pseudo}/providers/facebook`, body, {Authorization: ''});
    }

    linkGoogle(pseudo: string, body: any): Observable<any> {
        return this.requestSrv.put(`users/${pseudo}/providers/google`, body, {Authorization: ''});
    }

    putImage(file): Observable<any> {
        return this.requestSrv.putImage(`users/me/images/profile`, file, {Authorization: ''});
    }

    getImage(id: number): Observable<any> {
        return this.requestSrv.getImage(`users/${id}/images/profile`, {}, {Authorization: ''});
    }

    getGroups(pseudo: string): Observable<any> {
        return this.requestSrv.get(`users/${pseudo}/groups`, {}, {Authorization: ''});
    }

    getFriends(): Observable<any> {
        return this.requestSrv.get(`friends`, {}, {Authorization: ''});
    }

    inviteFriend(pseudo: string): Observable<any> {
        return this.requestSrv.postJSON(`users/${pseudo}/friend-invite`, {}, {Authorization: ''});
    }

    getFriendInvitations(): Observable<any> {
        return this.requestSrv.get('friend-invites', {}, {Authorization: ''});
    }

    getFriendInvitationStatus(pseudo: string): Observable<any> {
        return this.requestSrv.get(`friend-invites/${pseudo}`, {}, {Authorization: ''});
    }

    acceptFriendRequest(pseudo: string): Observable<any> {
        return this.requestSrv.postJSON(`friend-invites/${pseudo}/accept`, {}, {Authorization: ''});
    }

    declineFriendRequest(pseudo: string): Observable<any> {
        return this.requestSrv.postJSON(`friend-invites/${pseudo}/decline`, {}, {Authorization: ''});
    }

    searchUser(params: any): Observable<any> {
        return this.requestSrv.get(`search/users`, params, {Authorization: ''});
    }
}