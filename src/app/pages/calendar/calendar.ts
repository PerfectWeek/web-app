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
import enLocale from '@fullcalendar/core/locales/en-gb';
// import esLocale from '@fullcalendar/core/locales/es';
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
    @Input('displayMap') displayMap: boolean = true;

    @Input('role') role: string = 'admin';

    locale: frLocale;
    calendar_id: number = null;
    calendar_name: string = null;
    is_global_calendar: boolean = true;

    api: Calendar;

    display_map: boolean = false;
    switch_button_content: string = 'Carte';
    calendar_events: any = [];
    url_locale: string = 'fr';
    //events_with_address: any = [];

    eventsUpdate = this.profileSrv.EventsUpdate$.subscribe(hasChanged => {
        if (hasChanged === true) {
            this.events = [];

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
            this.profileSrv.EventsUpdateSubject.next(false);
        }
    });

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
        let incr = 0;
        let url_local;
        for (let i = 0; i <  window.location.href.length; i++) {
            incr += window.location.href[i] === '/' ? 1 : 0;
            if (incr === 3) {
                this.url_locale = window.location.href.substr(i + 1, 2).toLowerCase();
                break;
            }
        }
        this.calendar_id = +(this.router.url.slice(this.router.url.lastIndexOf('/') + 1));
        // this.url_locale = '';
        if (this.url_locale === 'en') {
            this.locale = enLocale;
        }
        else if (this.url_locale === 'fr') {
            this.locale = frLocale;
        }
        else {
            this.locale = frLocale;
        }


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
            });
        } else {
            this.role = 'admin';
        }
    }

    ngOnInit() {
        this.events = [];
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
                },
            },
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
            },
            plugins: [bootstrapPlugin, interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
            locales: [enLocale, frLocale],
            locale: this.locale,
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

    // get_calendar_events(calendar_id) {
    //     this.eventsSrv.getEvents(calendar_id !== -1 ? {"only_calendar_ids[]": calendar_id}: {}).subscribe(ret => {
    //         this.calendar_events = [];
    //         this.api.removeAllEvents();
    //         const borderColor_ = '#1C4891';
    //         this.calendar_events.push(...ret.events.filter(event => event.status === "going"));
    //         for (let event of this.calendar_events) {
    //             this.api.addEvent({
    //                 id: event.id,
    //                 title: event.name,
    //                 end: event.end_time,
    //                 start: event.start_time,
    //                 backgroundColor: event.color,
    //                 borderColor: borderColor_,
    //             });
    //         }
    //     });
    // }

    // async get_calendar_events(calendar_id) {
    //     let ret = await this.eventsSrv.getEvents(calendar_id !== -1 ? {"only_calendar_ids[]": calendar_id}: {}).first().toPromise();
    //     this.events = [];
    //     const borderColor_ = '#1C4891';
    //     this.calendar_events.push(...ret.events);
    //     for (let event of ret.events) {
    //         this.events.push({
    //             id: event.id,
    //             title: event.name,
    //             end: event.end_time,
    //             start: event.start_time,
    //             backgroundColor: event.color,
    //             borderColor: borderColor_,
    //             location: event.location,
    //             end_time: event.end_time,
    //             start_time: event.start_time,
    //         });
    //     }
    // }
    // get_calendar_events(calendar_id) {
    //     this.eventsSrv.getEvents(calendar_id !== -1 ? {"only_calendar_ids[]": calendar_id}: {}).subscribe(ret => {
    //         this.events = [];
    //         const borderColor_ = '#1C4891';
    //         this.calendar_events.push(...ret.events);
    //         for (let event of ret.events) {
    //             this.events.push({
    //                 id: event.id,
    //                 title: event.name,
    //                 end: event.end_time,
    //                 start: event.start_time,
    //                 backgroundColor: event.color,
    //                 borderColor: borderColor_,
    //                 location: event.location,
    //                 end_time: event.end_time,
    //                 start_time: event.start_time,
    //             });
    //         }
    //     });
    // }
    get_calendar_events(calendar_id) {
        this.eventsSrv.getEvents(calendar_id !== -1 ? {"only_calendar_ids[]": calendar_id}: {}).subscribe(ret => {
            this.events = [];
            const borderColor_ = '#1C4891';
            this.calendar_events = [...ret.events.filter(event => event.status === "going")];
            for (let event of this.calendar_events) {
                this.events.push({
                    id: event.id,
                    title: event.name,
                    end: event.end_time,
                    start: event.start_time,
                    backgroundColor: event.color,
                    borderColor: borderColor_,
                    location: event.location,
                    end_time: event.end_time,
                    start_time: event.start_time,
                });
            }
        });
    }
    // async get_calendar_events(calendar_id) {
    //     let ret = await this.eventsSrv.getEvents(calendar_id !== -1 ? {"only_calendar_ids[]": calendar_id}: {}).first().toPromise();
    //
    //         //this.events = []; //ici
    //         this.api.removeAllEvents();
    //         const borderColor_ = '#1C4891';
    //         this.calendar_events.push(...ret.events.filter(event => event.status === "going" || event.status === "none"));
    //         for (let event of this.calendar_events.filter(event => event.status === "going" || event.status === "none")) {
    //                 // this.events.push({
    //                 //     id: event.id,
    //                 //     title: event.name,
    //                 //     end: event.end_time,
    //                 //     start: event.start_time,
    //                 //     backgroundColor: event.color,
    //                 //     borderColor: borderColor_,
    //                 //     location: event.location,
    //                 //     end_time: event.end_time,
    //                 //     start_time: event.start_time,
    //                 // });
    //             this.api.addEvent({
    //                 id: event.id,
    //                 title: event.name,
    //                 end: event.end_time,
    //                 start: event.start_time,
    //                 location: event.location,
    //                 backgroundColor: event.color,
    //                 borderColor: borderColor_,
    //             });
    //         }
    // }

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
                locale: this.url_locale,
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result !== null && result !== undefined) {
                let test = {...result,
                    end_time: result.end,
                    start_time: result.start};
                delete test.visibility;
                delete test.type;
                this.events.push(test);
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
                    locale: this.url_locale,
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
                if (this.permSrv.permission[this.role].CRUD === false) {
                    this.toastSrv.error('Vous n\'avez pas les droits de lecture sûr cet évènement');
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
                            end_time: (modified_event.extendedProps.end_time.toString() === modified_event.extendedProps.start_time.toString()) ? modified_event.start.toISOString(): modified_event.end.toISOString(),
                            color: event.event.backgroundColor
                        }).subscribe(ret => {
                            this.toastSrv.success('Evenement modifié');
                            modified_event.setExtendedProp('start_time', ret.event.start_time);
                            modified_event.setExtendedProp('end_time', ret.event.end_time);
                            modified_event.setExtendedProp('location', resp.event.location);
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
                locale: this.url_locale,
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result !== null && result !== undefined) {
                this.toastSrv.info('Un créneau a été trouvé');
            }
        });
    }

    dateClick(model) {

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
                            end_time: (modified_event.extendedProps.end_time.toString() === modified_event.extendedProps.start_time.toString()) ? modified_event.start.toISOString(): modified_event.end.toISOString(),
                            color: ret.event.backgroundColor
                        }).subscribe(ret => {
                            this.toastSrv.success('Evenement modifié');
                        });
                    });
            });
        });
    }

    async switch_map_calendar() {
        // do the request for events
        const local_en = window.location.href.includes("/en/");
        if (this.display_map === false) {
            this.switch_button_content = local_en === true ? 'Calendar' : 'Calendrier';
        } else {
            this.switch_button_content = local_en === true ? "Map" : 'Carte';
            this.events = [];
            let ret = await this.eventsSrv.getEvents(this.in_calendar_id !== -1 ? {"only_calendar_ids[]": this.in_calendar_id}: {}).first().toPromise();
            ret.events.forEach(e => {
                this.events.push({
                    id: e.id,
                    title: e.name,
                    end: e.end_time,
                    start: e.start_time,
                    backgroundColor: e.color,
                    borderColor: '#1C4891',
                });
            });
        }
        this.display_map = !this.display_map;
    }
}
