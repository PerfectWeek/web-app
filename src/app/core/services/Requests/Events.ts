import {Injectable} from "@angular/core";
import {RequestService} from "../request.service";
import {Observable} from "rxjs/Rx";

@Injectable()
export class EventsService {

    constructor(private requestSrv: RequestService) {}

    getEvent(event_id: string): Observable<any> {
        return this.requestSrv.get(`events/${event_id}`, {}, {Authorization: ''});
    }

    modifyEvent(event_id: string, body: any): Observable<any> {
        return this.requestSrv.put(`events/${event_id}`, body,{Authorization: ''});
    }

    deleteEvent(event_id: string): Observable<any> {
        return this.requestSrv.delete(`events/${event_id}`, {Authorization: ''});
    }

    getAttendees(event_id: string): Observable<any> {
        return this.requestSrv.get(`events/${event_id}/attendees`, {}, {Authorization: ''});
    }

    removeAttendee(event_id: string, pseudo: string): Observable<any> {
        return this.requestSrv.delete(`events/${event_id}/attendees/${pseudo}`, {Authorization: ''});
    }

    inviteUser(event_id: string, users: any): Observable<any> {
        return this.requestSrv.post(`events/${event_id}/invite-users`, users, {Authorization: ''});
    }

    changeUserStatus(event_id: string, status: string): Observable<any> {
        return this.requestSrv.put(`events/${event_id}/status`, status, {Authorization: ''});
    }

    joinEvent(event_id: string, status?: string): Observable<any> {
        return this.requestSrv.post(`events/${event_id}/join`, status, {Authorization: ''});
    }

    uploadImage(event_id: string, file: any): Observable<any> {
        return this.requestSrv.postImage(`events/${event_id}/upload-image`, file, {Authorization: ''});
    }

    getImage(event_id: string): Observable<any> {
        return this.requestSrv.get(`events/${event_id}/image`, {}, {Authorization: ''});
    }

    getInvitations(): Observable<any> {
        return this.requestSrv.get('event-invites', {}, {Authorization: ''});
    }
}