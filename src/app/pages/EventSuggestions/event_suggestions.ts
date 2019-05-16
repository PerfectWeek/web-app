import {Component, Input, OnInit, ViewChild, HostListener, AfterViewInit} from "@angular/core";
import {RequestService} from "../../core/services/request.service";
import {ProfileService} from "../../core/services/profile.service";


@Component({
    selector: "event-suggestions",
    templateUrl: 'event_suggestions.html',
    styleUrls: ['event_suggestions.scss', '../../../scss/themes/main.scss']
})
export class EventSuggestionsComponent implements OnInit {

    private suggestions: any[] = [];
    private calendars: any[] = [];

    private focusedCalendar: any = null;

    private _calendar_id: number = -1;

    private min_date: Date = new Date();
    private max_date: Date = new Date(new Date().setMonth(this.min_date.getMonth() + 1)); // OMG IT IS HORRIBLE

    private options: any = { weekday: 'short', month: 'short', day: 'numeric' };

    private type_to_theme: any = {
        party: 'nightlife',
        work: 'business',
        hobby: 'people',
        workout: 'sports',
        other: 'abstract'
    };

    @ViewChild('calendar') calendar;


    constructor(private requestSrv: RequestService,
                private profileSrv: ProfileService) {
    }

    ngOnInit() {
        this.getCalendars();
    }

    get calendar_id() {
        return this._calendar_id;
    }

    getCalendars() {
        this.profileSrv.userProfile$.subscribe(user => {
            this.requestSrv.get(`users/${user.pseudo}/calendars`, {}, {Authorization: ''})
                .subscribe(calendars => {
                    this.calendars = calendars.calendars.map((c:any) => { return c.calendar; });
                })
        });
    }

    getSuggestions() {
        console.log(this.min_date, this.max_date);
        this.requestSrv.get(`calendars/${this.focusedCalendar.id}/assistant/get-event-suggestions`, {
            min_time: this.min_date.toISOString(),
            max_time: this.max_date.toISOString(),
            limit: 20,
        }, {Authorization: ''})
            .subscribe(events => {
                this.suggestions = events.suggestions.map(e => {
                    return {
                        id: e.event.id,
                        name: e.event.name,
                        description: e.event.description,
                        location: e.event.location,
                        type: e.event.type,
                        visibility: e.event.visibility,
                        calendar_id: e.event.calendar_id,
                        start_time: new Date(e.event.start_time),
                        end_time: new Date(e.event.end_time),
                        image: this.generateEventImage(e.event.type)
                    }
                });
                console.log(this.suggestions);
            })
    }

    generateEventImage(type) {
        return `https://lorempixel.com/400/200/${this.type_to_theme[type]}/${Math.floor((Math.random() * 1000 % 10))}`;
    }

    previewEvent(event) {
        console.log(this.calendar);
    }
}
