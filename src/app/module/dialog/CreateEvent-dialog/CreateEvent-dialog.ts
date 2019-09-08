import {Component, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {ProfileService} from '../../../core/services/profile.service';
import {RequestService} from '../../../core/services/request.service';

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
        //     console.log('error => ', error)
        // });
        // if (this.dialog_calendar_id != null) {
        //     route_id_calendar = this.dialog_calendar_id;
        // } else {
        //     route_id_calendar = this.data.calendar_id;
        // }

        this.profileSrv.userProfile$.subscribe(user => {
            this.requestSrv.get(`users/${user.pseudo}/calendars`, {}, {Authorization: ''})
                .subscribe(ret => {
                    console.log(ret.calendars);
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
        this.requestSrv.post(`calendars/${this.route_id_calendar}/events`, {
            name: this.name,
            type: this.eventType,
            location: this.location,
            description: this.description,
            visibility: this.eventVisibility,
            start_time: this.start.toISOString(),
            end_time: this.end.toISOString(),
        }, {Authorization: ''})
            .subscribe(ret => {
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
                this.toastSrv.success('Evenement ajouté au groupe');
                this.dialogRef.close();
            }, err => this.toastSrv.error('Une erreur est survenue lors de l\'ajout du nouvel evenement'));
    }
}
