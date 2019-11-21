import {Injectable} from "@angular/core";
import {RequestService} from "../request.service";
import {Observable} from "rxjs/Rx";

@Injectable()
export class EventsService {

    constructor(private requestSrv: RequestService) {}

    createEvent(body: any): Observable<any> {
        return this.requestSrv.postJSON(`events`, body, {Authorization: ''});
    }

    getEvents(): Observable<any> {
        return this.requestSrv.get(`events`, {}, {Authorization: ''});
    }

    getEvent(event_id: string): Observable<any> {
        return this.requestSrv.get(`events/${event_id}`, {}, {Authorization: ''});
    }

    modifyEvent(event_id: string, body: any): Observable<any> {
        return this.requestSrv.put(`events/${event_id}`, body,{Authorization: ''});
    }

    deleteEvent(event_id: string): Observable<any> {
        return this.requestSrv.delete(`events/${event_id}`, {Authorization: ''});
    }

    inviteUser(event_id: string, users): Observable<any> {
        return this.requestSrv.postJSON(`events/${event_id}/attendees`, users, {Authorization: ''});
    }

    changeStatus(event_id: string, status?: string): Observable<any> {
        return this.requestSrv.put(`events/${event_id}/attendees/me/status`, status, {Authorization: ''});
    }

    uploadImage(event_id: string, file: any): Observable<any> {
        return this.requestSrv.putImage(`events/${event_id}/images/icon`, file, {Authorization: ''});
    }

    getImage(event_id: string): Observable<any> {
        return this.requestSrv.getImage(`events/${event_id}/images/icon`, {}, {Authorization: ''});
    }

    getInvitations(): Observable<any> {
        return this.requestSrv.get('events', {}, {Authorization: ''});
    }

    editUserRole(event_id: string, user_id: number, role: string): Observable<any> {
        return this.requestSrv.put(`events/${event_id}/attendees/${user_id}/role`, role, {Authorization: ''});
    }
}

/**********************************************************************************\
*    The format Body function to be used when inviting multiple users to an event. *
*    Keeping it here as I'm not using it as of now but will need it later          *
\**********************************************************************************/

// formatBody(body) {
//     console.log('body => ', body);
//     let field = 'attendees';
//     let found: boolean = false;
//     let end = '"role":"actor"}';
//     let str = 'attendees":[';
//     for (let key in body) {
//         if (key.toString().indexOf(field) != -1) {
//             found = true;
//             str += JSON.stringify(body[key]) + ',';
//         }
//     }
//     str = str.slice(0, str.length - 1);
//     str += ']';
//     let result = JSON.stringify(body);
//     return found === true ? (result.substring(0, result.indexOf('attendees[0]')) + str + result.substring(result.lastIndexOf(end) + end.length)) : result;
// }