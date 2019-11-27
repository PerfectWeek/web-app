import {Component, OnInit, ViewChild, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {RequestService} from '../../core/services/request.service';
import {ProfileService} from '../../core/services/profile.service';
import {ToastrService} from 'ngx-toastr';
import {UsersService} from '../../core/services/Requests/Users';
import {CalendarsService} from '../../core/services/Requests/Calendars';
import {EventsService} from '../../core/services/Requests/Events';
import {User} from '../../core/models/User';

import * as imageUtils from "../../core/helpers/image"


@Component({
    selector: 'event-suggestions',
    templateUrl: 'event_suggestions.html',
    styleUrls: ['event_suggestions.scss', '../../../scss/themes/main.scss']
})
export class EventSuggestionsComponent implements OnInit {

    public suggestions: any[] = [];

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
    };


    eventTypes: any = [{value: 'party', viewValue: 'Fête', stat: true},
        {value: 'work', viewValue: 'Travail', stat: true},
        {value: 'hobby', viewValue: 'Loisir', stat: true},
        {value: 'workout', viewValue: 'Entrainement', stat: true}];

    search: string = '';

    user: User;
    calendars_id: any = [];
    user_events: any = [];
    user_events_id: any = [];

    @ViewChild('calendar') calendar;

    constructor(private requestSrv: RequestService,
                private toastSrv: ToastrService,
                private usersSrv: UsersService,
                private calendarsSrv: CalendarsService,
                private eventsSrv: EventsService,
                private profileSrv: ProfileService) {
    }

    check_filter() {
        console.log(this.eventTypes);
    }

    ngOnInit() {
        this.getCalendars();
        this.profileSrv.userProfile$.subscribe(ret => {
            this.user = ret;
            this.eventsSrv.getEvents().subscribe(ret => {
                const callAPI = this.getAPI();
                this.user_events.push(...ret.events);
                this.user_events.map(e => this.user_events_id.push(e.id));
            });
        });
    }

    get calendar_id() {
        return this._calendar_id;
    }

    getCalendars() {
        this.profileSrv.userProfile$.subscribe(user => {
            this.calendarsSrv.getConfirmedCalendars()
                .subscribe(calendars => {
                    this.focusedCalendar = calendars.calendars[0];
                    this.getSuggestions();
                });
        });
    }

    getSuggestions() {
        this.eventsSrv.getSuggestions({
            min_time: this.min_date.toISOString(),
            max_time: this.max_date.toISOString(),
        })
            .subscribe(events => {
                events.suggestions.forEach(event => {
                    this.eventsSrv.getImage(event.event.id)
                        .subscribe(ret => {
                            if (this.user_events_id.indexOf(event.event.id) === -1) {
                                let suggestion = {
                                    id: event.event.id,
                                    name: event.event.name,
                                    description: event.event.description,
                                    location: event.event.location,
                                    type: event.event.type,
                                    visibility: event.event.visibility,
                                    start_time: new Date(event.event.start_time),
                                    end_time: new Date(event.event.end_time),
                                    image: null
                                };
                                imageUtils.createImageFromBlob(ret, suggestion);
                                setTimeout(() => this.suggestions.push(suggestion), 50);
                            }
                        });
                });
            });
    }

    check_stat(event) {
        if (this.search !== '' && event.name.toLowerCase().indexOf(this.search.toLowerCase()) === -1
            && event.description.toLowerCase().indexOf(this.search.toLowerCase()) === -1
            && event.location.toLowerCase().indexOf(this.search.toLowerCase()) === -1) {
            return;
        }
        const index = this.eventTypes.findIndex(x => x.value === event.type);
        return (this.eventTypes[index].stat === true);
    }

    joinEvent(id) {
        this.eventsSrv.setEventStatus(id, 'going')
            .subscribe(response => {
                this.toastSrv.info('Cet évènement a bien été ajouté à votre liste d\'évènements');
                this.focusedEvent = null;
                this.suggestions = this.suggestions.filter(e => e.id !== id);
                const callAPI = this.getAPI();
                let test = callAPI.getEventById(id);
                const hexa = ['#f2db09', '#3d8fdc', '#45c4d9', '#cae602', '#ffd39b', '#c0e2e1', '#ccffff', '#9c6eb2'];
                const color = hexa[Math.floor(Math.random() * hexa.length)];
                test.setProp('backgroundColor', color);
                test.setProp('borderColor', color);
            }, err => this.toastSrv.error('Une erreur est survenue lors de l\'ajout à votre liste d\'évènement'));
    }

    generateEventImage(type) {
        return `https://lorempixel.com/600/300/${this.type_to_theme[type]}/${Math.floor((Math.random() * 1000 % 10))}`;
    }

    getAPI() {
        return this.calendar.calendarComponent.getApi();
    }

    closeEventPreview(api) {
        this.focusedEvent[0].remove();
    }

    previewEvent(event) {
        const api = this.getAPI();

        api.gotoDate(event.start_time);

        if (this.focusedEvent) {
            this.closeEventPreview(api);
        }
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
