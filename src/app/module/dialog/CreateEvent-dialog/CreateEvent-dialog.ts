import {Component, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {ProfileService} from '../../../core/services/profile.service';
import {RequestService} from '../../../core/services/request.service';

@Component({
    selector: 'createEvent-creation-dialog',
    templateUrl: 'CreateEvent-dialog.html',
    styles: ['.mat-raised-button {\n' +
    '  box-sizing: border-box;\n' +
    '  position: relative;\n' +
    '  -webkit-user-select: none;\n' +
    '  -moz-user-select: none;\n' +
    '  -ms-user-select: none;\n' +
    '  user-select: none;\n' +
    '  cursor: pointer;\n' +
    '  outline: 0;\n' +
    '  border: none;\n' +
    '  -webkit-tap-highlight-color: transparent;\n' +
    '  display: inline-block;\n' +
    '  white-space: nowrap;\n' +
    '  text-decoration: none;\n' +
    '  vertical-align: baseline;\n' +
    '  text-align: center;\n' +
    '  margin: 0;\n' +
    '  min-width: 88px;\n' +
    '  line-height: 36px;\n' +
    '  padding: 0 16px;\n' +
    '  border-radius: 2px;\n' +
    '  overflow: visible;\n' +
    '  transform: translate3d(0, 0, 0);\n' +
    '  transition: background .4s cubic-bezier(.25, .8, .25, 1), box-shadow 280ms cubic-bezier(.4, 0, .2, 1);\n' +
    '  box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);\n' +
    '}']
})
export class CreateEventDialog {

    name: string = null;
    location: string = null;
    eventType: string = null;
    description: string = null;
    eventVisibility = 'public';
    color: any;
    start: Date;
    end: Date;

    user: any = null;
    calendars_list: any;
    dialog_calendar_id: string = null;

    eventTypes: any = [{value: 'party', viewValue: 'Fête'},
        {value: 'work', viewValue: 'Travail'},
        {value: 'hobby', viewValue: 'Hobby'},
        {value: 'workout', viewValue: 'Entrainement'}];

    eventVisibilities: any = [{value: 'public', viewValue: 'Publique'},
        {value: 'private', viewValue: 'Privé'}];

    @ViewChild('userInput') userInput;

    constructor(private requestSrv: RequestService,
                private profileSrv: ProfileService,
                private toastSrv: ToastrService,
                public dialogRef: MatDialogRef<CreateEventDialog>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.profileSrv.userProfile$.subscribe(user => {
            this.requestSrv.get(`users/${user.pseudo}/calendars`, {}, {Authorization: ''})
                .subscribe(ret => {
                    this.calendars_list = ret.calendars;
                });
        });
    }


    createEvent() {
        let route_id_calendar;
        if (this.dialog_calendar_id != null) {
            route_id_calendar = this.dialog_calendar_id;
        } else {
            route_id_calendar = this.data.calendar_id;
        }

        this.requestSrv.post(`calendars/${route_id_calendar}/events`, {
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
