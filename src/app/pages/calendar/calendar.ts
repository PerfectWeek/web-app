import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    NgZone,
    OnChanges,
    OnInit, QueryList,
    SimpleChanges,
    ViewChild,
    ViewChildren
} from '@angular/core';
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
import {Calendar} from '@fullcalendar/core/Calendar';
import {UsersService} from '../../core/services/Requests/Users';
import {CalendarsService} from '../../core/services/Requests/Calendars';
import {EventsService} from '../../core/services/Requests/Events';
import {GroupsService} from '../../core/services/Requests/Groups';
import {PermissionService} from '../../core/services/permission.service';

@Component({
    selector: 'mwl-demo-component',
    styleUrls: ['calendar.scss',
        '../../../scss/dialog.scss',
        '../../../scss/themes/main.scss'],
    templateUrl: 'calendar.html',

})
export class CalendarComponent implements OnInit, OnChanges, AfterViewInit {
    options: OptionsInput;
    @ViewChild('fullcalendar') calendarComponent: FullCalendarComponent;
    events: EventInput[] = [];

    @Input('in_calendar_id') in_calendar_id = null;
    @Input('displayOnly') displayOnly: boolean = false;

    @Input('role') role: string = 'admin';

    locale: 'fr';
    calendar_id: number = null;
    calendar_name: string = null;
    is_global_calendar: boolean = true;

    api: Calendar;

    display_map: boolean = false;
    switch_button_content: string = 'Carte';
    calendar_events: any = [];
    events_with_address: any = [];

    constructor(private modal: NgbModal,
                public dialog: MatDialog,
                private requestSrv: RequestService,
                private profileSrv: ProfileService,
                private calendarsSrv: CalendarsService,
                private eventsSrv: EventsService,
                private usersSrv: UsersService,
                private toastSrv: ToastrService,
                private groupsSrv: GroupsService,
                public permSrv: PermissionService,
                private router: Router) {
    }

    ngOnChanges(changes: SimpleChanges) {
        this.calendar_id = +(this.router.url.slice(this.router.url.lastIndexOf('/') + 1));
        this.is_global_calendar = (!Number.isNaN(this.calendar_id)) ? false : true;
        this.events = [];
        this.in_calendar_id = changes.in_calendar_id.currentValue;

        if (this.in_calendar_id === -1) {
            this.get_global_calendar();
            this.is_global_calendar = true;

        } else {
            this.is_global_calendar = false;
            this.get_in_group_calendar();
        }

        if (this.is_global_calendar === false) {
            this.calendarsSrv.getCalendar(this.in_calendar_id).subscribe(ret => {
                this.role = ret.calendar.role;

                // this.api.setOption('editable', this.permSrv.permission[this.role].CRUD); // maybe delete
            });
        } else {
            this.role = 'admin';
            // this.api.setOption('editable', this.permSrv.permission[this.role].CRUD); // maybe delete
        }
    }

    ngOnInit() {
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
                        //this.addEventCallback();
                        this.addEvent();
                    },
                },
                FoundSlotButton: {
                    text: 'Trouver un créneau',
                    click: async () => {
                        this.foundSlots();
                    },
                },
            },
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
                // right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
            },
            // footer: {
            //     right: 'FoundSlotButton,addEventButton',
            //     center: '',
            // },
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

    ngAfterViewInit(): void {
        this.api = this.calendarComponent.getApi();
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
        this.eventsSrv.getEvents(calendar_id !== -1 ? {"only_calendar_ids[]": calendar_id}: {}).subscribe(ret => {
            this.api.removeAllEvents();
            const borderColor_ = '#1C4891';
            this.calendar_events.push(...ret.events.filter(event => event.status === "going"));
            for (let event of this.calendar_events) {
                this.api.addEvent({
                    id: event.id,
                    title: event.name,
                    end: event.end_time,
                    start: event.start_time,
                    backgroundColor: event.color,
                    borderColor: borderColor_,
                });
            }
        });
    }

    get_in_group_calendar(): void {
        this.get_calendar_events(this.in_calendar_id);
        this.calendarsSrv.getCalendar(this.in_calendar_id)
            .subscribe(ret => {
                this.calendar_name = ret.calendar.name;
            });
    }

    get_group_calendar(): void {
        this.get_calendar_events(this.calendar_id);
        this.calendarsSrv.getCalendar(this.calendar_id)
            .subscribe(ret => {
                this.calendar_name = ret.calendar.name;
            });
    }

    get_global_calendar(): void {
        this.get_calendar_events(-1);
    }

    addEvent(): void {
        const dialogRef = this.dialog.open(CreateEventDialog, {
            width: '650px',
            data: {
                calendar_id: this.in_calendar_id ? this.in_calendar_id : this.calendar_id,
                // calAPI: calAPI_,
                // calendar_id: this.calendar_id,
                calAPI: this.api,
                is_global_calendar: this.is_global_calendar,
                calendar_locale: this.locale,
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result !== null && result !== undefined) {

                this.toastSrv.success('L\'événement a bien été créé');
            }
        });
    }

    eventClick(event) {
        this.eventsSrv.getEvent(event.event.id).subscribe(ret => {
            this.profileSrv.userProfile$.subscribe(user => {
                let me = ret.event.attendees.filter(attendee => attendee.id === user.id);
                this.role = me[0].role;
                if (this.permSrv.permission[this.role].read === false) {
                    this.toastSrv.error('Vous n\'avez pas les droits de lecture sûr cette évènement');
                    return;
                }
            });
            const dialogRef = this.dialog.open(ModifyEventDialog, {
                width: '650px',
                data: {
                    event,
                    calendar_locale: this.locale,
                    calAPI: this.api,
                    role: this.role
                }
            });
            dialogRef.afterClosed()
                .subscribe(() => this.in_calendar_id === -1 ? this.get_global_calendar() : this.get_in_group_calendar());
            if (this.is_global_calendar === true) {
                this.role = 'admin';
            }
        });
    }

    eventDragStop(event): void {
        ;
    }

    eventDrop(event): void {
        this.eventsSrv.getEvent(event.event.id).subscribe(ret => {
            this.profileSrv.userProfile$.subscribe(user => {
                let me = ret.event.attendees.filter(attendee => attendee.id === user.id);
                this.role = me[0].role;
                if (this.permSrv.permission[this.role].read === false) {
                    this.toastSrv.error('Vous n\'avez pas les droits de lecture sûr cette évènement');
                    return;
                }
                const api = this.getAPI();
                const modified_event = api.getEventById(event.event.id);
                this.eventsSrv.getEvent(event.event.id)
                    .subscribe(resp => {
                        this.eventsSrv.modifyEvent(event.event.id, {
                            name: event.event.title,
                            type: resp.event.type,
                            location: resp.event.location,
                            visibility: resp.event.visibility,
                            description: resp.event.description,
                            start_time: modified_event.start.toISOString(),
                            end_time: modified_event.end.toISOString(),
                            color: event.event.backgroundColor
                        }).subscribe(ret => {
                            this.toastSrv.success('Evenement modifié');
                        });
                    });
            });
        });
    }

    foundSlots(): void {
        const dialogRef = this.dialog.open(FoundSlotDialog, {
            width: '650px',
            data: {
                calendar_id: this.in_calendar_id ? this.in_calendar_id : this.calendar_id,
                calAPI: this.api,
                is_global_calendar: this.is_global_calendar,
                calendar_locale: this.locale,
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result !== null && result !== undefined) {
                this.toastSrv.info('Un créneau a été trouvé');
            }
        });
    }

    dateClick(model) {
        // console.log("oui", model.date);
        // this.api.changeView('timeGridDay');
        // this.api.gotoDate(model.date);
    }

    eventResize(event) {
        this.eventsSrv.getEvent(event.event.id).subscribe(ret => {
            this.profileSrv.userProfile$.subscribe(user => {
                let me = ret.event.attendees.filter(attendee => attendee.id === user.id);
                this.role = me[0].role;
                if (this.permSrv.permission[this.role].read === false) {
                    this.toastSrv.error('Vous n\'avez pas les droits de lecture sûr cette évènement');
                    return;
                }
                const api = this.getAPI();
                const modified_event = api.getEventById(event.event.id);
                this.eventsSrv.getEvent(event.event.id)
                    .subscribe(resp => {
                        this.eventsSrv.modifyEvent(event.event.id, {
                            name: event.event.title,
                            type: resp.event.type,
                            location: resp.event.location,
                            visibility: resp.event.visibility,
                            description: resp.event.description,
                            start_time: modified_event.start.toISOString(),
                            end_time: modified_event.end.toISOString(),
                            color: ret.event.backgroundColor
                        }).subscribe(ret => {
                            this.toastSrv.success('Evenement modifié');
                        });
                    });
            });
        });
    }

    switch_map_calendar() {
        // do the request for events
        if (this.display_map === false) {
        //if (true) {
            this.events_with_address = this.calendar_events.filter(e => e.location !== '' && new Date(e.end_time) > new Date());
            // console.log("dkoedoe", filter_events);
            // console.log("dkoedoe", filter_events[0]);
            // filter_events.forEach(elem => {
            //     console.log("test", elem.location);
            //     // setTimeout(() => {this.findLocation(elem.location); }, 500);
            // });
            // console.log("nike", this.all_pos);
            // this.findLocation(filter_events[0].location);
            this.switch_button_content = 'Calendrier';
        } else {
            this.switch_button_content = 'Carte';

            const hexa = ['#e06868', '#ff906a', '#f2db09', '#3d8fdc', '#45c4d9', '#cae602', '#ffd39b', '#c0e2e1', '#ccffff', '#9c6eb2'];
            const backgroundColor_ = hexa[Math.floor(Math.random() * hexa.length)];
            const borderColor_ = '#1C4891';
            this.events = [];
            let tmp = this.api.getEvents();
            // this.api.removeAllEvents();
            tmp.forEach(e => {
                this.events.push({
                        id: e.id,
                        title: e.title,
                        end: e.end,
                        start: e.start,
                        backgroundColor: '#ababab',
                        borderColor: '#ffffff',
                    });
            });
            // let tmp = this.api.getEvents();
            // this.api.removeAllEvents();
            // this.events = [];
            // tmp.forEach(e => {
            //     this.api.addEvent({
            //         id: e.id,
            //         title: e.title,
            //         end: e.end,
            //         start: e.start,
            //         backgroundColor: '#ababab',
            //         borderColor: '#ffffff',
            //     });
            // });
        }
        this.display_map = !this.display_map;
    }
}
