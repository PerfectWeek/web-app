import {Component, Input, ViewChild, NgZone, OnInit, OnChanges, SimpleChanges, AfterViewInit, SimpleChange} from '@angular/core';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core';
import {CreateEventDialog} from '../../module/dialog/CreateEvent-dialog/CreateEvent-dialog';
import {ToastrService} from 'ngx-toastr';
import {MatDialog} from '@angular/material';
import {ModifyEventDialog} from '../../module/dialog/ModifyEvent-dialog/ModifyEvent';
import {EventsService} from '../../core/services/Requests/Events';
import {PermissionService} from '../../core/services/permission.service';
import {ProfileComponent} from '../User/profile/profile';
import {ProfileService} from '../../core/services/profile.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';

declare var google: any;

interface Marker {
    lat: number;
    lng: number;
    label?: string;
    draggable: boolean;
}

interface Location {
    lat: number;
    lng: number;
    viewport?: Object;
    zoom: number;
    address_level_1?: string;
    address_level_2?: string;
    address_country?: string;
    address_zip?: string;
    address_state?: string;
    marker?: Marker;
}

@Component({
    selector: 'map',
    styleUrls: ['map.scss'],
    templateUrl: 'map.html',
})

export class MapComponent implements OnInit, OnChanges {
    geocoder: any;
    public location: Location = {
        lat: 48.8534,
        lng: 2.3488,
        marker: {
            lat: 48.8534,
            lng: 2.3488,
            draggable: false
        },
        zoom: 12
    };

    @ViewChild(AgmMap) map: AgmMap;
    @Input('in_calendar_id') in_calendar_id;
    @Input('calendarApi') api: any;
    @Input('is_global_calendar') is_global_calendar: boolean;
    @Input('calendar_locale') locale;
    @Input('role') role;

    @Input('address') address: any = [];
    @Input('all_location') all_location: any = [];

    all_location_subject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    all_location$: Observable<boolean> = this.all_location_subject.asObservable();

    all_location_update = this.all_location$.subscribe(hasChanged => {
        if (hasChanged === true) {
            this.updateMapLocations();
            this.all_location_subject.next(false);
        }
    });

    constructor(
                public mapsApiLoader: MapsAPILoader,
                private zone: NgZone,
                private wrapper: GoogleMapsAPIWrapper,
                private eventsSrv: EventsService,
                private toastSrv: ToastrService,
                private permSrv: PermissionService,
                private profileSrv: ProfileService,
                private dialog: MatDialog) {
        this.mapsApiLoader = mapsApiLoader;
        this.zone = zone;
        this.wrapper = wrapper;
        this.mapsApiLoader.load().then(() => {
            try {
            this.geocoder = new google.maps.Geocoder();
            } catch (e) {
                console.log('error => ', e.message);
            }
        });
    }

    ngOnInit() {
        this.location.marker.draggable = false;
    }

    async ngOnChanges(changes: SimpleChanges) {
        this.updateMapLocations();
    }

    async updateMapLocations() {
        let tmp = [];
        const ret = await this.eventsSrv.getEvents(this.in_calendar_id !== -1 ? {"only_calendar_ids[]": this.in_calendar_id}: {}).first().toPromise();
        [...ret.events.filter(event => event.status === "going" || event.status === "none")].forEach((e, index) => {
            if (e.location !== '' && new Date(e.end_time) > new Date()) {
                tmp.push(e);
            }
            if (index === ret.events.length - 1) {
                this.address = tmp;
            }
        });
        // if (tmp.length > 10) //DEBUG A SUPPRIMER
        // {
        //     return;
        // }
        this.all_location = [];
        for (const event of this.address) {
            this.findLocation(event);
        }
        this.map.triggerResize();
    }

    updateOnMap() {
        let full_address: string = this.location.address_level_1 || "";
        if (this.location.address_level_2) {
            full_address = full_address + " " + this.location.address_level_2;
        }
        if (this.location.address_state) {
            full_address = full_address + " " + this.location.address_state;
        }
        if (this.location.address_country) {
            full_address = full_address + " " + this.location.address_country;
        }
        this.findLocation(full_address);
    }

    findLocation(event) {
        if (!this.geocoder) {
            try {
            this.geocoder = new google.maps.Geocoder();
            } catch (e) {
                console.log('error => ', e.message);
                setTimeout(this.findLocation, 100);
                return;
            }
        }
        this.geocoder.geocode({
            'address': event.location
        }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
                for (var i = 0; i < results[0].address_components.length; i++) {
                    let types = results[0].address_components[i].types;
                    if (types.indexOf('locality') !== -1) {
                        this.location.address_level_2 = results[0].address_components[i].long_name;
                    }
                    if (types.indexOf('country') !== -1) {
                        this.location.address_country = results[0].address_components[i].long_name;
                    }
                    if (types.indexOf('postal_code') !== -1) {
                        this.location.address_zip = results[0].address_components[i].long_name;
                    }
                    if (types.indexOf('administrative_area_level_1') !== -1) {
                        this.location.address_state = results[0].address_components[i].long_name;
                    }
                }
                if (results[0].geometry.location) {
                    this.location.lat = results[0].geometry.location.lat();
                    this.location.lng = results[0].geometry.location.lng();
                    this.location.marker.lat = results[0].geometry.location.lat();
                    this.location.marker.lng = results[0].geometry.location.lng();
                    this.location.marker.draggable = false;
                    this.location.viewport = results[0].geometry.viewport;
                }
                this.all_location.push({lat: +results[0].geometry.location.lat(),
                    lng: +results[0].geometry.location.lng(),
                    name: event.name,
                    id: event.id});
                this.map.triggerResize();
            } else {
                //console.log("event", event.location, "end", event.end_time, "CANT BE LOAD");
            }
        });
    }

    async modify_event(marker, event_id) {
        const test = {event: {id: event_id}};
        const ret = await this.eventsSrv.getEvent(event_id).first().toPromise();
        const user = await this.profileSrv.userProfile$.first().toPromise();
        const me = ret.event.attendees.filter(attendee => attendee.id === user.id);
        this.role = me[0].role;
        if (this.permSrv.permission[this.role].read === false) {
            this.toastSrv.error('Vous n\'avez pas les droits de lecture sûr cette évènement');
            return;
        }
        const dialogRef = this.dialog.open(ModifyEventDialog, {
            width: '650px',
            data: {
                event: test,
                calendar_locale: this.locale,
                calAPI: this.api,
                role: this.role
            }
        });
        await dialogRef.afterClosed().first().toPromise();
        this.all_location = [];
        this.all_location_subject.next(true);
        const different = [...this.all_location.filter(event => event.id !== event_id)];
        const modified_event = await this.eventsSrv.getEvent(event_id).first().toPromise();
            if (this.is_global_calendar === true) {
                this.role = 'admin';
            }
    }

    findAddressByCoordinates(lat, lng): Observable<any> {
        return new Observable(observer => {
            this.geocoder.geocode({'location': {
                lat: lat,
                lng: lng
            }}, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK) {
                    observer.next(results);
                    observer.complete();
                } else {
                    console.log('Error: ', results, ' & Status: ', status);
                    observer.error();
                }
            });
        });
    }

    async create_event(info) {
        const results = await this.findAddressByCoordinates(info.coords.lat, info.coords.lng).first().toPromise();
        const dialogRef = this.dialog.open(CreateEventDialog, {
            width: '650px',
            data: {
                geocode_address: results[0].formatted_address,
                calendar_id: this.in_calendar_id,
                calAPI: this.api,
                is_global_calendar: this.is_global_calendar,
                calendar_locale: this.locale,
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result !== null && result !== undefined) {
                this.all_location.push({lat: info.coords.lat,
                    lng: info.coords.lng,
                    name: result.title,
                    id: result.id
                });
                this.toastSrv.success('L\'événement a bien été créé');
            }
        });
    }
}
