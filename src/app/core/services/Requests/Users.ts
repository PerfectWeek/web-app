import {Injectable} from "@angular/core";
import {RequestService} from "../request.service";
import {Observable} from "rxjs/Rx";

@Injectable()
export class UsersService {

    constructor(private requestSrv: RequestService) {
    }

    createUser(user): Observable<any> {
        return this.requestSrv.post('users', user);
    }

    putTimezone(pseudo: string): Observable<any> {
        return this.requestSrv.put(`users/${pseudo}/timezone`, {
            timezone: new Date().getTimezoneOffset()
        }, {Authorization: ''});
    }

    getUser(pseudo: string): Observable<any> {
        return this.requestSrv.get(`users/${pseudo}`, {}, {Authorization: ''});
    }

    modifyUser(pseudo: string, body: any): Observable<any> {
        return this.requestSrv.put(`users/${pseudo}`, body, {Authorization: ''});
    }

    deleteUser(pseudo: string): Observable<any> {
        return this.requestSrv.delete(`users/${pseudo}`, {Authorization: ''});
    }

    linkFacebook(pseudo: string, body: any): Observable<any> {
        return this.requestSrv.put(`users/${pseudo}/providers/facebook`, body, {Authorization: ''});
    }

    linkGoogle(pseudo: string, body: any): Observable<any> {
        return this.requestSrv.put(`users/${pseudo}/providers/google`, body, {Authorization: ''});
    }

    postImage(pseudo: string, file): Observable<any> {
        return this.requestSrv.postImage(`users/${pseudo}/upload-image`, file, {Authorization: ''});
    }

    getImage(pseudo: string): Observable<any> {
        return this.requestSrv.get(`users/${pseudo}/image`, {}, {Authorization: ''});
    }

    getGroups(pseudo: string): Observable<any> {
        return this.requestSrv.get(`users/${pseudo}/groups`, {}, {Authorization: ''});
    }

    getCalendars(pseudo: string): Observable<any> {
        return this.requestSrv.get(`users/${pseudo}/calendars`, {}, {Authorization: ''});
    }

    getFriends(): Observable<any> {
        return this.requestSrv.get(`friends`, {}, {Authorization: ''});
    }

    inviteFriend(pseudo: string): Observable<any> {
        return this.requestSrv.post(`users/${pseudo}/friend-invite`, {}, {Authorization: ''});
    }

    getFriendInvitations(): Observable<any> {
        return this.requestSrv.get('friend-invites', {}, {Authorization: ''});
    }

    getFriendInvitationStatus(pseudo: string): Observable<any> {
        return this.requestSrv.get(`friend-invites/${pseudo}`, {}, {Authorization: ''});
    }

    acceptFriendRequest(pseudo: string): Observable<any> {
        return this.requestSrv.post(`friend-invites/${pseudo}/accept`, {}, {Authorization: ''});
    }

    declineFriendRequest(pseudo: string): Observable<any> {
        return this.requestSrv.post(`friend-invites/${pseudo}/decline`, {}, {Authorization: ''});
    }

    searchUser(params: any): Observable<any> {
        return this.requestSrv.get(`search/users`, params, {Authorization: ''});
    }
}