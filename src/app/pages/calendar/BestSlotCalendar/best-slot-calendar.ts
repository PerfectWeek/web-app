import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {OptionsInput} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import {FullCalendarComponent} from '@fullcalendar/angular';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MatDialog} from '@angular/material';
import {RequestService} from '../../../core/services/request.service';
import {ProfileService} from '../../../core/services/profile.service';
import {EventInput} from '@fullcalendar/core/structs/event';
import frLocale from '@fullcalendar/core/locales/fr';
import esLocale from '@fullcalendar/core/locales/es';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import {Calendar} from '@fullcalendar/core/Calendar';
import {UsersService} from "../../../core/services/Requests/Users";
import {CalendarsService} from "../../../core/services/Requests/Calendars";

@Component({
    selector: 'best-slot_calendar-component',
    styleUrls: ['../../../../scss/themes/main.scss', 'best-slot-calendar.scss'],
    templateUrl: 'best-slot-calendar.html',

})
export class BestSlotCalendarComponent implements OnInit {
    options: OptionsInput;
    @ViewChild('fullcalendar') calendarComponent: FullCalendarComponent;
    events: EventInput[] = [];

    locale: 'fr';
    api: Calendar;
    cursor: string;


    @Input() slot: any;
    @Input() temp_event: any;

    constructor(private modal: NgbModal,
                public dialog: MatDialog,
                private requestSrv: RequestService,
                private usersSrv: UsersService,
                private calendarsSrv: CalendarsService,
                private profileSrv: ProfileService) {
    }

    ngOnInit() {
        //this.temp_event = JSON.parse(this.temp_event);
        //this.slot = JSON.parse(this.slot);
        const tmp_date = new Date(this.slot.start_time);
        this.cursor = (tmp_date.getHours() - 4) + ':00:00';
        // console.log(this.cursor, typeof this.cursor);
        // console.log(this.temp_event);
        this.options = {
            editable: false,
            //plugins: [bootstrapPlugin, interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
            plugins: [timeGridPlugin, bootstrapPlugin],
            defaultView: 'timeGridWeek',
            // defaultView: 'timeGridDay',
            locales: [esLocale, frLocale],
            locale: frLocale,
            buttonIcons: false,
            weekNumbers: true,
            navLinks: true,
            eventLimit: true,
            themeSystem: 'bootstrap',
        };
        setTimeout(() => {
            this.api = this.calendarComponent.getApi();
            this.api.addEvent({
                start: this.slot.start_time,
                end: this.slot.end_time,
                title: this.temp_event.name,
                backgroundColor: '#FAA401',
                borderColor: '#1C4891',
            });
            this.api.updateSize();
            this.api.gotoDate(this.slot.start_time);
            this.get_global_calendar();
        }, 500);
    }

    get_calendar_events(calendar_id) {
        this.calendarsSrv.getEvents(calendar_id)
            .subscribe(ret => {
                const hexa = ["#3d8fdc"];
                const backgroundColor_ = hexa[Math.floor(Math.random() * hexa.length)];
                // const backgroundColor_ = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
                const borderColor_ = '#1C4891';
                for (const idx in ret.events) {
                    this.api.addEvent({
                        id: ret.events[idx].id,
                        title: ret.events[idx].name,
                        end: ret.events[idx].end_time,
                        start: ret.events[idx].start_time,
                        backgroundColor: backgroundColor_,
                        borderColor: borderColor_,
                    });

                }
            });
    }

    get_global_calendar(): void {
        this.profileSrv.userProfile$.subscribe(user => {
            this.calendarsSrv.getConfirmedCalendars()
                .subscribe(ret => {
                    for (let idx in ret.calendars) {
                        this.get_calendar_events(ret.calendars[idx].calendar.id);
                    }
                });
        });
    }
}
