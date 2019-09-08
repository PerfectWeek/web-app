import {Component, OnInit, ViewChild, Inject} from "@angular/core";
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {RequestService} from "../../core/services/request.service";
import {ProfileService} from "../../core/services/profile.service";
import {ToastrService} from "ngx-toastr";
import {UsersService} from "../../core/services/Requests/Users";
import {CalendarsService} from "../../core/services/Requests/Calendars";
import {EventsService} from "../../core/services/Requests/Events";


@Component({
    selector: "event-suggestions",
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
        other: 'abstract'
    };


    eventTypes: any = [{value: 'party', viewValue: 'Fête', stat: true},
        {value: 'work', viewValue: 'Travail', stat: true},
        {value: 'hobby', viewValue: 'Loisir', stat: true},
        {value: 'workout', viewValue: 'Entrainement', stat: true}];

    search: string = '';

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
    }

    get calendar_id() {
        return this._calendar_id;
    }

    getCalendars() {
        this.profileSrv.userProfile$.subscribe(user => {
            this.usersSrv.getCalendars(user.pseudo)
                .subscribe(calendars => {
                    this.focusedCalendar = calendars.calendars[0].calendar;
                    this.getSuggestions();
                })
        });
    }

    getSuggestions() {
        this._calendar_id = this.focusedCalendar.id;
        this.calendarsSrv.getEventSuggestion(this.focusedCalendar.id, {
            min_time: this.min_date.toISOString(),
            max_time: this.max_date.toISOString(),
            limit: 20,
        })
            .subscribe(events => {
                for (let key in events.suggestions) {
                    this.requestSrv.get(`events/${events.suggestions[key].event.id}/image`, {}, {Authorization: ''}).subscribe(ret => {
                        this.suggestions.push({
                            id: events.suggestions[key].event.id,
                            name: events.suggestions[key].event.name,
                            description: events.suggestions[key].event.description,
                            location: events.suggestions[key].event.location,
                            type: events.suggestions[key].event.type,
                            visibility: events.suggestions[key].event.visibility,
                            calendar_id: events.suggestions[key].event.calendar_id,
                            start_time: new Date(events.suggestions[key].event.start_time),
                            end_time: new Date(events.suggestions[key].event.end_time),
                            image: ret.image
                        });
                    });
                }
                // this.suggestions = events.suggestions.map(e => {
                //         return {
                //             id: e.event.id,
                //             name: e.event.name,
                //             description: e.event.description,
                //             location: e.event.location,
                //             type: e.event.type,
                //             visibility: e.event.visibility,
                //             calendar_id: e.event.calendar_id,
                //             start_time: new Date(e.event.start_time),
                //             end_time: new Date(e.event.end_time),
                //             image: this.generateEventImage(e.event.type, e.event.id),
                //         };
                //});
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
            this.eventsSrv.joinEvent(id)
            .subscribe(response => {
                this.toastSrv.info("Cet évènement a bien été ajouté à votre liste d'évènements");
            }, err => this.toastSrv.error("Une erreur est survenue lors de l'ajout à votre liste d'évènement"));
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
