import {Component, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {ProfileService} from '../../../core/services/profile.service';
import {RequestService} from '../../../core/services/request.service';
import {FoundSlotConfirmDialog} from '../FoundSlotConfirm-dialog/FoundSlotConfirm-dialog';

@Component({
    selector: 'FoundSlot-dialog',
    templateUrl: 'FoundSlot-dialog.html',
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
export class FoundSlotDialog {
    name: string;
    location: string;
    eventType: string;
    description: string;
    start: Date;
    end: Date;
    heure: number;
    minute: number;
    eventVisibility = 'public';

    user: any = null;
    calendars_list: any;
    dialog_calendar_id: string = null;

    eventTypes: any = [{value: 'party', viewValue: 'Fête'},
        {value: 'work', viewValue: 'Travail'},
        {value: 'hobby', viewValue: 'Loisir'},
        {value: 'workout', viewValue: 'Entrainement'}];

    eventVisibilities: any = [{value: 'public', viewValue: 'Publique'},
        {value: 'private', viewValue: 'Privé'}];


    @ViewChild('userInput') userInput;

    constructor(private requestSrv: RequestService,
                private profileSrv: ProfileService,
                private toastSrv: ToastrService,
                public dialogRef: MatDialogRef<FoundSlotDialog>,
                public dialog: MatDialog,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.profileSrv.userProfile$.subscribe(user => {
            this.requestSrv.get(`users/${user.pseudo}/calendars`, {}, {Authorization: ''})
                .subscribe(ret => {
                    this.calendars_list = ret.calendars;
                });
        });
    }


    ChooseSlot(route_id_calendar, slots, event) {
        // Open a New modal for choose a slot
        const dialogConfirmRef = this.dialog.open(FoundSlotConfirmDialog, {
            width: '1000px',
            data: {
                calendar_id: route_id_calendar,
                slots,
                event,
                calAPI_: this.data.calAPI
            }
        });
        dialogConfirmRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result !== null && result !== undefined) {
                console.log('Réponse enregistré');
            }
        });
    }

    FoundSlot() {
        const start = this.start.toISOString();
        const end = this.end.toISOString();
        // const start = '2019-05-09T00:00:00.000Z';
        // const end = '2019-05-09T19:23:00.000Z';

        console.log(start, end);
        let route_id_calendar;
        if (this.dialog_calendar_id != null) {
            route_id_calendar = this.dialog_calendar_id;
        } else {
            route_id_calendar = this.data.calendar_id;
        }
        this.requestSrv.get(`calendars/${route_id_calendar}/assistant/find-best-slots`,
            {
                min_time: start,
                max_time: end,
                type: this.eventType,
                location: this.location,
                duration: this.heure * 60 + this.minute
            }, {Authorization: ''})
            .subscribe(slots => {
                this.toastSrv.success('Recherche de créneau en cours');
                this.dialogRef.close();
                this.ChooseSlot(route_id_calendar, slots, {
                    name: this.name,
                    type: this.eventType,
                    location: this.location,
                    visibility: this.eventVisibility,
                    description: this.description,
                    start: this.start,
                    end: this.end,
                    minute: this.minute,
                    heure: this.heure,
                });
                // this.ChooseSlot(route_id_calendar, slots, {
                //     name: 'oui',
                //     type: 'hobby',
                //     location: 'oui',
                //     visibility: 'oui',
                //     description: 'oui',
                //     start: this.start,
                //     end: this.end,
                //     minute: 1,
                //     heure: 1,
                // });
            }, err => this.toastSrv.error('Une erreur est survenue lors de la recherche d\'evenement'));
    }
}
