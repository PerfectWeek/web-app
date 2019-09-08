import {Component, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {ProfileService} from '../../../core/services/profile.service';
import {RequestService} from '../../../core/services/request.service';
import {UsersService} from "../../../core/services/Requests/Users";
import {CalendarsService} from "../../../core/services/Requests/Calendars";

@Component({
    selector: 'createEvent-creation-dialog',
    templateUrl: 'CreateEvent-dialog.html',
    styleUrls: ['CreateEvent-dialog.scss', '../../../../scss/dialog.scss'],
})
export class CreateEventDialog {

    name: string = null;
    location: string = "";
    eventType: string = null;
    description: string = "";
    eventVisibility = 'public';
    //is_global_calendar = true; //important
    color: any;
    start: Date;
    end: Date;

    user: any = null;
    calendars_list: any;
    dialog_calendar_id: string = null;

    image: any = null;
    route_id_calendar;

    eventTypes: any = [{value: 'party', viewValue: 'Fête'},
        {value: 'work', viewValue: 'Travail'},
        {value: 'hobby', viewValue: 'Loisir'},
        {value: 'workout', viewValue: 'Entrainement'}];

    eventVisibilities: any = [{value: 'public', viewValue: 'Public'},
        {value: 'private', viewValue: 'Privé'}];

    rd_only = false;

    current_date = new Date();
    @ViewChild('userInput') userInput;

    constructor(private requestSrv: RequestService,
                private profileSrv: ProfileService,
                private usersSrv: UsersService,
                private calendarsSrv: CalendarsService,
                private toastSrv: ToastrService,
                public dialogRef: MatDialogRef<CreateEventDialog>,
                @Inject(MAT_DIALOG_DATA) public data: any) {

                if (data.event) {
                    this.rd_only = true;
                    this.eventType = data.event.type;
                    this.location = data.event.location;
                    this.start = data.event.start;
                    this.end = data.event.end;
                }
                else
                    console.log("ZERTYUIOP");
        console.log("read only", this.rd_only);
        // this.profileSrv.userProfile$.subscribe(user => {
        //     this.requestSrv.get(`users/${user.pseudo}/image`, {}, {Authorization: ''})
        //         .subscribe(ret => {
        //             this.image = ret.image;
        //         });
        // }, (error) => {
        // });
        // if (this.dialog_calendar_id != null) {
        //     route_id_calendar = this.dialog_calendar_id;
        // } else {
        //     route_id_calendar = this.data.calendar_id;
        // }

        this.profileSrv.userProfile$.subscribe(user => {
            this.usersSrv.getCalendars(user.pseudo)
                .subscribe(ret => {
                    this.calendars_list = ret.calendars;
                });
        });

    }


    createEvent() {
        // let route_id_calendar;
        // if (this.dialog_calendar_id != null) {
        //     route_id_calendar = this.dialog_calendar_id;
        // } else {
        //     route_id_calendar = this.data.calendar_id;
        // }
        this.route_id_calendar = (this.dialog_calendar_id != null) ? this.dialog_calendar_id : this.data.calendar_id;
        this.calendarsSrv.createEvent(this.route_id_calendar, {
            name: this.name,
            type: this.eventType,
            location: this.location,
            description: this.description,
            visibility: this.eventVisibility,
            start_time: this.start.toISOString(),
            end_time: this.end.toISOString(),
        }).subscribe(ret => {
                this.data.calAPI.addEvent({
                    id: ret.event.id,
                    title: this.name,
                    start: this.start,
                    end: this.end,
                    type: this.eventType,
                    location: this.location,
                    backgroundColor: this.color,
                    description: this.description,
                    visibility: this.eventVisibility,
                });
                (<any>window).ga('send', 'event', 'Events', 'Event Creation', `Event Name: ${this.name}`);
                this.toastSrv.success('Evenement ajouté au groupe');
                this.dialogRef.close();
            }, err => this.toastSrv.error('Une erreur est survenue lors de l\'ajout du nouvel evenement'));
    }
}
