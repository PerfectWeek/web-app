import {Injectable} from "@angular/core";
import {RequestService} from "../request.service";
import {Observable} from "rxjs/Rx";

@Injectable()
export class InvitationsService {
    constructor(private requestSrv: RequestService) {}

    inviteFriend(user_id: number): Observable<any> {
        return this.requestSrv.postJSON(`friends/${user_id}`, {}, {Authorization: ""});
    }

    acceptFriendInvitation(user_id: number): Observable<any> {
        return this.requestSrv.postJSON(`friends/${user_id}/accept`,{}, {Authorization: ""});
    }

    declineFriendInvitation(user_id: number): Observable<any> {
        return this.requestSrv.postJSON(`friends/${user_id}/decline`,{}, {Authorization: ""});
    }

    getFriends(params?: any): Observable<any> {
        return this.requestSrv.get('friends', params, {Authorization: ""});
    }

    removeFriend(user_id: number): Observable<any> {
        return this.requestSrv.get(`friends/${user_id}`, {}, {Authorization: ""});
    }
}