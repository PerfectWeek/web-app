import {Injectable} from "@angular/core";
import {RequestService} from "../request.service";
import {Observable} from "rxjs/Rx";

@Injectable()
export class CalendarsService {

    constructor(private requestSrv: RequestService) {}

    createCalendar(body: any) {
        return this.requestSrv.postJSON(`calendars`, body, {Authorization: ''});
    }

    getCalendar(calendar_id: number): Observable<any> {
        return this.requestSrv.get(`calendars/${calendar_id}`, {}, {Authorization: ''});
    }

    getAllCalendars(): Observable<any> {
        return this.requestSrv.get(`calendars`, {}, {Authorization: ''});
    }

    getPendingCalendars(): Observable<any> {
        return this.requestSrv.get(`calendars`, {'invitation_status': 'pending'}, {Authorization: ''});
    }

    getConfirmedCalendars(): Observable<any> {
        return this.requestSrv.get(`calendars`, {'invitation_status': 'confirmed'}, {Authorization: ''});
    }

    modifyCalendar(calendar_id: number, name: string): Observable<any> {
        return this.requestSrv.put(`calendars/${calendar_id}`, {name}, {Authorization: ''});
    }

    deleteCalendar(calendar_id: number): Observable<any> {
        return this.requestSrv.delete(`calendars/${calendar_id}`, {Authorization: ''});
    }

    uploadImage(calendar_id: number, file: any): Observable<any> {
        return this.requestSrv.putImage(`calendars/${calendar_id}/images/icon`, file, {Authorization: ''});
    }

    getImage(calendar_id: number): Observable<any> {
        return this.requestSrv.getImage(`calendars/${calendar_id}/images/icon`, {}, {Authorization: ''})
    }

    getEvents(calendar_id: number): Observable<any> {
        return this.requestSrv.get(`calendars/${calendar_id}/events`, {}, {Authorization: ''});
    }

    addEvent(calendar_id: number, event_id: number): Observable<any> {
        return this.requestSrv.postJSON(`calendars/${calendar_id}/events`, {event_id}, {Authorization: ''});
    }

    removeEvent(calendar_id: number, event_id: number): Observable<any> {
        return this.requestSrv.delete(`calendars/${calendar_id}/events/${event_id}`, {Authorization: ''});
    }

    inviteUsers(calendar_id: number, users): Observable<any> {
        return this.requestSrv.postJSON(`calendars/${calendar_id}/members`, users, {Authorization: ''});
    }

    removeMember(calendar_id: number, user_id: number): Observable<any> {
        return this.requestSrv.delete(`calendars/${calendar_id}/members/${user_id}`, {Authorization: ''});
    }

    getInvitations(): Observable<any> {
        return this.requestSrv.get(`calendars`, {'invitation_status': 'pending'}, {Authorization: ''});
    }

    acceptInvitation(calendar_id: number): Observable<any> {
        return this.requestSrv.postJSON(`calendars/${calendar_id}/member-invite/accept`, {}, {Authorization: ''});
    }

    declineInvitation(calendar_id: number): Observable<any> {
        return this.requestSrv.postJSON(`calendars/${calendar_id}/member-invite/decline`, {}, {Authorization: ''});
    }

    editUserRole(calendar_id: number, user_id: number, role: string): Observable<any> {
        return this.requestSrv.put(`calendars/${calendar_id}/members/${user_id}/role`, role, {Authorization: ''});
    }

    findBestSlot(calendar_id: number, params: any): Observable<any> {
        return this.requestSrv.get(`assistant/find-best-slot/${calendar_id}`, params, {Authorization: ''});
    }

    getEventSuggestion(calendar_id: number, params: any): Observable<any> {
        return this.requestSrv.get(`assistant/get-event-suggestions`, params,{Authorization: ''});
    }

}