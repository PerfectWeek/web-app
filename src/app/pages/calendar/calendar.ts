import {AfterViewInit, Component, ElementRef, Input, NgZone, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
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

import {AgmMap, GoogleMapsAPIWrapper, MapsAPILoader} from '@agm/core';

// declare var google: any;
//
// interface Marker {
//     lat: number;
//     lng: number;
//     label?: string;
//     draggable: boolean;
// }
//
// interface Location {
//     lat: number;
//     lng: number;
//     viewport?: Object;
//     zoom: number;
//     // address_level_1?:string;
//     // address_level_2?: string;
//     // address_country?: string;
//     // address_zip?: string;
//     // address_state?: string;
//     marker?: Marker;
// }


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

    // lat: number = 48.8534;
    // lng: number = 2.3488;
    display_map: boolean = false;
    switch_button_content: string = 'Calendrier';
    calendar_events: any = [];
    events_with_address: any = [];
    //
    // all_pos: Location[] = [];
    // public location:Location = {};//{
    //     // lat: 51.678418,
    //     // lng: 7.809007,
    //     // marker: {
    //     //     lat: 51.678418,
    //     //     lng: 7.809007,
    //     //     draggable: true
    //     // },
    //     // zoom: 5
    // //};
    // @ViewChild(AgmMap) map: AgmMap;
    // geocoder: any;

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
        // this.mapsApiLoader = mapsApiLoader;
        // this.zone = zone;
        // this.wrapper = wrapper;
        // this.mapsApiLoader.load().then(() => {
        //     this.geocoder = new google.maps.Geocoder();
        // });
    }

    // findLocation(address) {
    //     if (!this.geocoder) {
    //         this.geocoder = new google.maps.Geocoder();
    //     }
    //     this.geocoder.geocode({
    //         'address': address
    //     }, (results, status) => {
    //         console.log('results', results);
    //         if (status === google.maps.GeocoderStatus.OK) {
    //             for (var i = 0; i < results[0].address_components.length; i++) {
    //                 let types = results[0].address_components[i].types;
    //
    //                 // if (types.indexOf('locality') !== -1) {
    //                 //     this.location.address_level_2 = results[0].address_components[i].long_name;
    //                 // }
    //                 // if (types.indexOf('country') !== -1) {
    //                 //     this.location.address_country = results[0].address_components[i].long_name;
    //                 // }
    //                 // if (types.indexOf('postal_code') !== -1) {
    //                 //     this.location.address_zip = results[0].address_components[i].long_name;
    //                 // }
    //                 // if (types.indexOf('administrative_area_level_1') !== -1) {
    //                 //     this.location.address_state = results[0].address_components[i].long_name;
    //                 // }
    //             }
    //             if (results[0].geometry.location) {
    //                 this.location.lat = results[0].geometry.location.lat();
    //                 this.location.lng = results[0].geometry.location.lng();
    //                 //this.all_pos.push(this.location);
    //                 this.location.marker.lat = results[0].geometry.location.lat();
    //                 this.location.marker.lng = results[0].geometry.location.lng();
    //                 this.location.marker.draggable = true;
    //                 this.location.viewport = results[0].geometry.viewport;
    //             }
    //             this.map.triggerResize();
    //         } else {
    //             alert("Sorry, this search produced no results.");
    //         }
    //     });
    // }

    // findLocation(address) {
    //     if (!this.geocoder) {
    //         this.geocoder = new google.maps.Geocoder();
    //     }
    //     this.geocoder.geocode({
    //         'address': address
    //     }, (results, status) => {
    //         console.log(results);
    //         if (status === google.maps.GeocoderStatus.OK) {
    //             // decompose the result
    //         } else {
    //             console.log("trouve pas l'adresse");
    //         }
    //     });
    // }

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
            this.calendarsSrv.getCalendars(this.in_calendar_id).subscribe(ret => {
                this.role = ret.calendar.role;
            });
        } else {
            this.role = 'admin';
        }
    }

    ngOnInit() {
        // this.test_map() //ici
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
                }
            },
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
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
        //this.events_with_address = this.calendar_events.filter(e => e.location !== '' && new Date(e.end_time) > new Date());
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
        // const calAPI = this.getAPI();
        this.api.removeAllEvents();
        this.calendarsSrv.getEvents(calendar_id)
            .subscribe(ret => {
                const hexa = ['#e06868', '#ff906a', '#f2db09', '#3d8fdc', '#45c4d9', '#cae602', '#ffd39b', '#c0e2e1', '#ccffff', '#9c6eb2'];
                const backgroundColor_ = hexa[Math.floor(Math.random() * hexa.length)];
                //const backgroundColor_ = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
                const borderColor_ = '#1C4891';
                this.calendar_events.push(...ret.events);
                //this.calendar_events.push(ret.events);


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

    get_in_group_calendar(): void {
        this.get_calendar_events(this.in_calendar_id);
        this.calendarsSrv.getCalendars(this.in_calendar_id)
            .subscribe(ret => {
                this.calendar_name = ret.calendar.name;
            });
    }

    get_group_calendar(): void {
        this.get_calendar_events(this.calendar_id);
        this.calendarsSrv.getCalendars(this.calendar_id)
            .subscribe(ret => {
                this.calendar_name = ret.calendar.name;
            });
    }

    get_global_calendar(): void {
        this.profileSrv.userProfile$.subscribe(user => {
            this.usersSrv.getCalendars(user.pseudo)
                .subscribe(ret => {
                    for (let idx in ret.calendars) {
                        this.get_calendar_events(ret.calendars[idx].calendar.id);
                    }
                });
        });
    }

    // get_group_info() {
    //     this.calendar_id = +(this.router.url.slice(this.router.url.lastIndexOf('/') + 1));
    //     this.is_global_calendar = (!Number.isNaN(this.calendar_id)) ? false : true;
    //     // if (!Number.isNaN(this.calendar_id)) {
    //     //     this.is_global_calendar = false;
    //     //     this.get_group_calendar();
    //     // } else {
    //     //     this.is_global_calendar = true;
    //     //     this.get_global_calendar();
    //     // }
    // }

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
            //console.log(ret);
            this.calendarsSrv.getCalendars(ret.event.calendar_id).subscribe(ret => {
                // console.log(ret);
                this.role = ret.calendar.role;
                if (this.permSrv.permission[this.role].read === false) {
                    this.toastSrv.error('Vous n\'avez pas les droits de lecture sûr cette évènement');
                    return;
                }

                const dialogRef = this.dialog.open(ModifyEventDialog, {
                    width: '650px',
                    data: {
                        event,
                        calendar_locale: this.locale,
                        calAPI: this.api,
                        role: this.role
                    }
                });
                if (this.is_global_calendar === true) {
                    this.role = 'admin';
                }
            });
        });


        // const dialogRef = this.dialog.open(ModifyEventDialog, {
        //     width: '650px',
        //     data: {
        //         event,
        //         calendar_locale: this.locale,
        //         calAPI: this.api,
        //         role: this.role
        //     }
        // });
    }

    eventDragStop(event): void {
        ;
    }

    eventDrop(event): void {
        this.eventsSrv.getEvent(event.event.id).subscribe(ret => {
            //console.log(ret);
            this.calendarsSrv.getCalendars(ret.event.calendar_id).subscribe(ret => {
                //console.log(ret);
                this.role = ret.calendar.role;
                if (this.permSrv.permission[this.role].CRUD === false) {
                    this.toastSrv.error(`En temps que ${this.permSrv.permission[this.role].frRole} vous n'êtes pas autorisez à modifier la durée de cette évènement, vos modification ne seront pas prises en comptes`);
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
                // calAPI: calAPI_,
                // calendar_id: this.calendar_id,
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
            //console.log(ret);
            this.calendarsSrv.getCalendars(ret.event.calendar_id).subscribe(ret => {
                //console.log(ret);
                this.role = ret.calendar.role;
                if (this.permSrv.permission[this.role].CRUD === false) {
                    this.toastSrv.error(`En temps que ${this.permSrv.permission[this.role].frRole} vous n'êtes pas autorisez à modifier la durée de cette évènement, vos modification ne seront pas prises en comptes`);
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
            this.switch_button_content = 'Map';
        }
        this.display_map = !this.display_map;
    }

    // clickedevent(a, b) {
    //     // console("clicked event", a, b);
    // }
    //
    // eventDragEnd(a, b) {
    //     // console("event drag end", a, b);
    // }
}
