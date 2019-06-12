import {Injectable} from "@angular/core";
import {RequestService} from "../request.service";
import {Observable} from "rxjs/Rx";

@Injectable()
export class CalendarsService {

    constructor(private requestSrv: RequestService) {}

    createCalendar(name: string): Observable<any> {
        return this.requestSrv.post('calendars', {name}, {Authorization: ''});
    }

    getCalendars(calendar_id: number): Observable<any> {
        return this.requestSrv.get(`calendars/${calendar_id}`, {}, {Authorization: ''});
    }

    modifyCalendar(calendar_id: number, name: string): Observable<any> {
        return this.requestSrv.put(`calendars/${calendar_id}`, {name}, {Authorization: ''});
    }

    deleteCalendar(calendar_id: number): Observable<any> {
        return this.requestSrv.delete(`calendars/${calendar_id}`, {Authorization: ''});
    }

    getEvents(calendar_id: number): Observable<any> {
        return this.requestSrv.get(`calendars/${calendar_id}/events`, {}, {Authorization: ''});
    }

    createEvent(calendar_id: number, body: any): Observable<any> {
        return this.requestSrv.post(`calendars/${calendar_id}/events`, body, {Authorization: ''});
    }

    findBestSlot(calendar_id: number, params: any): Observable<any> {
        return this.requestSrv.get(`calendars/${calendar_id}/assistant/find-best-slots`, params, {Authorization: ''});
    }

    getEventSuggestion(calendar_id: number, params: any): Observable<any> {
        return this.requestSrv.get(`calendars/${calendar_id}/assistant/get-event-suggestions`, params,{Authorization: ''});
    }

}