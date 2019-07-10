import {Component, OnInit, ViewChild, Inject} from "@angular/core";
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {RequestService} from "../../core/services/request.service";
import {ProfileService} from "../../core/services/profile.service";
import {ToastrService} from "ngx-toastr";


@Component({
    selector: "event-suggestions",
    templateUrl: 'event_suggestions.html',
    styleUrls: ['event_suggestions.scss', '../../../scss/themes/main.scss']
})
export class EventSuggestionsComponent implements OnInit {

    public suggestions: any[] = [];

    private isVisible = true;
    private focusedCalendar: any = null;
    public focusedEvent: any = null;

    private _calendar_id: number = -1;

    private min_date: Date = new Date();
    private max_date: Date = new Date(new Date().setMonth(this.min_date.getMonth() + 1)); // OMG IT IS HORRIBLE

    private options: any = {weekday: 'short', month: 'short', day: 'numeric'};
    private options_full: any = {weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric'};


    private type_to_theme: any = {
        party: 'nightlife',
        work: 'business',
        hobby: 'people',
        workout: 'sports',
        other: 'abstract'
    };

    @ViewChild('calendar') calendar;


    constructor(private requestSrv: RequestService,
                private toastSrv: ToastrService,
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
                    this.focusedCalendar = calendars.calendars[0].calendar;
                    this.getSuggestions();
                })
        });
    }

    getSuggestions() {
        this._calendar_id = this.focusedCalendar.id;
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
            })
    }

    joinEvent(id) {
        this.requestSrv.post(`events/${id}/join`, {}, {Authorization: ''})
            .subscribe(response => {
                this.toastSrv.info('Cet évènement a bien été ajouté à votre liste d\'évènements');
            }, err => this.toastSrv.error('Une erreur est survenue lors de l\'ajout à votre liste d\'évènement'));
    }

    generateEventImage(type) {
        return `https://lorempixel.com/600/300/${this.type_to_theme[type]}/${Math.floor((Math.random() * 1000 % 10))}`;
    }

    deleteEvent(elem) {
        console.log("ID     ", elem);
        console.log("Suggestion before ", this.suggestions);
        for (let i = 0; i < Object.keys(this.suggestions).length; i++) {
            if (elem['id'] === this.suggestions[i]['id']) {
                this.suggestions.splice(i, 1);
                this.isVisible = false;
            }
        }
    }

    getAPI() {
        return this.calendar.calendarComponent.getApi();
    }

    closeEventPreview() {
        this.focusedEvent[0].remove();
    }

    previewEvent(event) {
        const api = this.getAPI();
        if (this.focusedEvent) {
            this.closeEventPreview();
        }
        this.isVisible = true;
        this.focusedEvent = [api.addEvent({
            id: event.id,
            title: event.name,
            end: event.end_time,
            start: event.start_time,
            backgroundColor: 'orange',
            borderColor: 'orange',
        }), event];
    }
}
