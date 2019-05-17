import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {OptionsInput} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import {FullCalendarComponent} from '@fullcalendar/angular';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MatDialog} from '@angular/material';
import {RequestService} from '../../core/services/request.service';
import {ProfileService} from '../../core/services/profile.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {EventInput} from '@fullcalendar/core/structs/event';
import {CreateEventDialog} from '../../module/dialog/CreateEvent-dialog/CreateEvent-dialog';
import frLocale from '@fullcalendar/core/locales/fr';
import esLocale from '@fullcalendar/core/locales/es';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import {FoundSlotDialog} from '../../module/dialog/FoundSlot-dialog/FoundSlot-dialog';
import {ConfirmDialog} from '../../module/dialog/Confirm-dialog/Confirm-dialog';
import {ModifyEventDialog} from '../../module/dialog/ModifyEvent-dialog/ModifyEvent';

@Component({
    selector: 'mwl-demo-component',
    styleUrls: ['../../../scss/themes/main.scss', 'calendar.scss'],
    templateUrl: 'calendar.html',

})
export class CalendarComponent implements OnInit, OnChanges {
    options: OptionsInput;
    @ViewChild('fullcalendar') calendarComponent: FullCalendarComponent; // the #calendar in the template
    events: EventInput[] = [];

    @Input('in_calendar_id') in_calendar_id = null;

    constructor(private modal: NgbModal,
                public dialog: MatDialog,
                private requestSrv: RequestService,
                private profileSrv: ProfileService,
                private toastSrv: ToastrService,
                private router: Router) {
    }

    locale: string = 'fr';
    calendar_id: number = null;
    calendar_name: string = null;
    is_global_calendar: boolean = true;

    ngOnChanges(changes: SimpleChanges) {
        this.events = [];
        this.in_calendar_id = changes.in_calendar_id.currentValue;
        if (this.in_calendar_id === -1) {
            this.get_global_calendar();
            this.is_global_calendar = true;
        }
        else {
            this.is_global_calendar = false;
            this.get_in_group_calendar()
        }
    }

    ngOnInit() {
        console.log('calendar_id => ', this.in_calendar_id);
        this.events = [];
        // this.get_group_info();
        // if (this.in_calendar_id) {
        //     (this.in_calendar_id === -1) ? this.get_global_calendar() : this.getInGroupCalendar();
        // }
        // else
        //     this.get_group_info();
        this.options = {
            editable: true,
            customButtons: {
                addEventButton: {
                    text: 'Ajouter un evenement',
                    click: async () => {
                        this.addEvent();
                    },
                },
                FoundSlotButton: {
                    text: 'Trouver un créneau',
                    click: async () => {
                        this.foundSlots();
                    },
                }
            },
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'FoundSlotButton,addEventButton,dayGridMonth,timeGridWeek,timeGridDay,listMonth'
            },
            plugins: [bootstrapPlugin, interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
            locales: [esLocale, frLocale],
            locale: frLocale,
            buttonIcons: false,
            weekNumbers: true,
            navLinks: true,
            eventLimit: true,
            themeSystem: 'bootstrap',
        };
    }

    deleteEvent(elem): void {
        const dialogRef = this.dialog.open(ConfirmDialog, {
            data: {
                title: 'Suppression d\'evenement',
                question: 'Voulez-vous vraiment supprimer cette evenement ?'
            }
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    getAPI() {
        return this.calendarComponent.getApi();
    }

    get_calendar_events(calendar_id) {
        const calAPI = this.getAPI();
        calAPI.removeAllEvents();
        this.requestSrv.get(`calendars/${calendar_id}/events`, {}, {Authorization: ''})
            .subscribe(ret => {
                const backgroundColor_ = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
                const borderColor_ = '#1C4891';
                console.log("ret => ", ret);
                for (const idx in ret.events) {
                    calAPI.addEvent({
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

    get_in_group_calendar(): void {
        this.get_calendar_events(this.in_calendar_id);
        this.requestSrv.get(`calendars/${this.in_calendar_id}`, {}, {Authorization: ''})
            .subscribe(ret => {
                this.calendar_name = ret.calendar.name;
            });
    }

    get_group_calendar(): void {
        this.get_calendar_events(this.calendar_id);
        this.requestSrv.get(`calendars/${this.calendar_id}`, {}, {Authorization: ''})
            .subscribe(ret => {
                this.calendar_name = ret.calendar.name;
            });
    }

    get_global_calendar(): void {
        console.log('GLOBAL');
        this.profileSrv.userProfile$.subscribe(user => {
            this.requestSrv.get(`users/${user.pseudo}/calendars`, {}, {Authorization: ''})
                .subscribe(ret => {
                    for (let idx in ret.calendars) {
                        this.get_calendar_events(ret.calendars[idx].calendar.id);
                    }
                });
        });
    }

    get_group_info() {
        this.calendar_id = +(this.router.url.slice(this.router.url.lastIndexOf('/') + 1));
        if (!Number.isNaN(this.calendar_id)) {
            this.is_global_calendar = false;
            this.get_group_calendar();
        } else {
            this.is_global_calendar = true;
            this.get_global_calendar();
        }
    }

    addEvent(): void {
        const calAPI_ = this.getAPI();
        const dialogRef = this.dialog.open(CreateEventDialog, {
            data: {
                calendar_id: this.in_calendar_id ? this.in_calendar_id : this.calendar_id,
                calAPI: calAPI_,
                is_global_calendar: this.is_global_calendar,
                calendar_locale: this.locale,
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result !== null && result !== undefined) {
                console.log('Event created');
            }
        });
    }

    eventClick(event) {
        const calAPI = this.getAPI();
        const dialogRef = this.dialog.open(ModifyEventDialog, {
            data: {
                event,
                calendar_locale: this.locale,
                calAPI
            }
        });
    }

    eventDragStop(event): void {
        console.log(event);
    }

    eventDrop(event): void {
        const api = this.getAPI();
        const modified_event = api.getEventById(event.event.id);
        this.requestSrv.get(`events/${event.event.id}`, {}, {Authorization: ''})
            .subscribe(resp => {
                this.requestSrv.put(`events/${event.event.id}`, {
                        name: event.event.title,
                        type: resp.event.type,
                        location: resp.event.location,
                        visibility: resp.event.visibility,
                        description: resp.event.description,
                        start_time: modified_event.start.toISOString(),
                        end_time: modified_event.end.toISOString(),
                    },
                    {Authorization: ''})
                    .subscribe(ret => {
                        this.toastSrv.success('Evenement modifié');
                    });
            });
    }

    foundSlots(): void {
        const calAPI_ = this.getAPI();
        const dialogRef = this.dialog.open(FoundSlotDialog, {
            data: {
                calendar_id: this.in_calendar_id ? this.in_calendar_id : this.calendar_id,
                calAPI: calAPI_,
                is_global_calendar: this.is_global_calendar,
                calendar_locale: this.locale,
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result !== null && result !== undefined) {
                console.log('Creneau trouvé');
            }
        });
    }

    dateClick(model) {
        console.log('DATE CLICK', model);
    }
}
