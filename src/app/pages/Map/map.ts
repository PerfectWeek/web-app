import {Component, Input, ViewChild, NgZone, OnInit, OnChanges, SimpleChanges, AfterViewInit} from '@angular/core';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core';

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

export class MapComponent implements OnInit, AfterViewInit {
    geocoder: any;
    public all_location: Location[] = [];
    // public location: any;
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
    @Input('address') address: any = {};

    constructor(public mapsApiLoader: MapsAPILoader,
                private zone: NgZone,
                private wrapper: GoogleMapsAPIWrapper) {
        this.mapsApiLoader = mapsApiLoader;
        this.zone = zone;
        this.wrapper = wrapper;
        this.mapsApiLoader.load().then(() => {
            this.geocoder = new google.maps.Geocoder();
        });
    }

    ngOnInit() {
        this.location.marker.draggable = false;
    }

    ngAfterViewInit() {
        console.log("coucou", this.address);
        for (let event of this.address) {
            console.log("a oui oui ouiiiiii");
            setTimeout(() => { this.findLocation(event); }, 500);
        }
        console.log("apres", this.all_location);
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
            this.geocoder = new google.maps.Geocoder();
        }
        this.geocoder.geocode({
            'address': event.location
        }, (results, status) => {
            console.log(results);
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
                // this.all_location.push(this.location);
                this.all_location.push({lat: results[0].geometry.location.lat(),
                                        lng: results[0].geometry.location.lng(),
                                        name: event.name});
                this.map.triggerResize();
            } else {
                alert("Sorry, this search produced no results.");
            }
        });
    }

    create_event(info) {
        console.log("crée un evenement", info);
        this.findAddressByCoordinates(info.coords.lat, info.coords.lng);
    }

    // markerDragEnd(m: any, $event: any) {
    //     this.location.marker.lat = m.coords.lat;
    //     this.location.marker.lng = m.coords.lng;
    //     this.findAddressByCoordinates();
    // }

    findAddressByCoordinates(lat, lng) {
        this.geocoder.geocode({
            'location': {
                lat: lat,
                lng: lng
            }
        }, (results, status) => {
            console.log(results, status);
            // this.decomposeAddressComponents(results);
        });
    }

    // decomposeAddressComponents(addressArray) {
    //     if (addressArray.length === 0) {
    //         return false;
    //     }
    //     let address = addressArray[0].address_components;
    //     for (let element of address) {
    //         if (element.length === 0 && !element['types']) {
    //             continue;
    //         }
    //         if (element['types'].indexOf('street_number') > -1) {
    //             this.location.address_level_1 = element['long_name'];
    //             continue;
    //         }
    //         if (element['types'].indexOf('route') > -1) {
    //             this.location.address_level_1 += ', ' + element['long_name'];
    //             continue;
    //         }
    //         if (element['types'].indexOf('locality') > -1) {
    //             this.location.address_level_2 = element['long_name'];
    //             continue;
    //         }
    //         if (element['types'].indexOf('administrative_area_level_1') > -1) {
    //             this.location.address_state = element['long_name'];
    //             continue;
    //         }
    //         if (element['types'].indexOf('country') > -1) {
    //             this.location.address_country = element['long_name'];
    //             continue;
    //         }
    //         if (element['types'].indexOf('postal_code') > -1) {
    //             this.location.address_zip = element['long_name'];
    //             continue;
    //         }
    //     }
    // }
}
