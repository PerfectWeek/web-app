import {Component, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {ProfileService} from '../../../core/services/profile.service';
import {RequestService} from '../../../core/services/request.service';
import {FoundSlotConfirmDialog} from '../FoundSlotConfirm-dialog/FoundSlotConfirm-dialog';
import {UsersService} from "../../../core/services/Requests/Users";
import {CalendarsService} from "../../../core/services/Requests/Calendars";
import {PermissionService} from '../../../core/services/permission.service';

@Component({
    selector: 'FoundSlot-dialog',
    templateUrl: 'FoundSlot-dialog.html',
    styleUrls: ['FoundSlot-dialog.scss', '../../../../scss/dialog.scss']
})
export class FoundSlotDialog {
    //name: string;
    eventType: string = 'hobby';
    //description: string;
    start: Date;
    end: Date;
    location = '';
    heure: number = 1;
    minute: number = 0;
    limit: number = 10;
    //eventVisibility = 'public';

    user: any = null;
    calendars_list: any;
    dialog_calendar_id: string = null;

    eventTypes: any = [{value: 'party', viewValue: 'Fête'},
        {value: 'work', viewValue: 'Travail'},
        {value: 'hobby', viewValue: 'Loisir'},
        {value: 'workout', viewValue: 'Entrainement'}];

    eventVisibilities: any = [{value: 'public', viewValue: 'Public'},
        {value: 'private', viewValue: 'Privé'}];

    current_date = new Date();

    @ViewChild('userInput') userInput;

    constructor(private requestSrv: RequestService,
                private profileSrv: ProfileService,
                private usersSrv: UsersService,
                private calendarsSrv: CalendarsService,
                private toastSrv: ToastrService,
                public PermSrv: PermissionService,
                public dialogRef: MatDialogRef<FoundSlotDialog>,
                public dialog: MatDialog,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.profileSrv.userProfile$.subscribe(user => {
            this.calendarsSrv.getConfirmedCalendars()
                .subscribe(ret => {
                    // console.log(ret.calendars);
                    // let a = ret.calendars.filter(e => { if (PermSrv.permission[e.calendar.role].CRUD === true) return e});
                    // console.log(a);
                    this.calendars_list = ret.calendars.filter(e => { if (PermSrv.permission[e.role].CRUD === true) {return e;} } );
                    //this.calendars_list = ret.calendars;
                });
        });
    }


    ChooseSlot(route_id_calendar, slots, event) {
        // Open a New modal to choose a slot
        if (slots.slots.length !== 0) {
            const dialogConfirmRef = this.dialog.open(FoundSlotConfirmDialog, {
                width: '1300px',
                data: {
                    calendar_id: route_id_calendar,
                    slots,
                    event,
                    calAPI_: this.data.calAPI
                }
            });
            dialogConfirmRef.afterClosed().subscribe(result => {
                if (result !== null && result !== undefined) {
                    this.toastSrv.info("Votre slot a bien été enregistré")
                }
            });
        }
        else {
            this.toastSrv.error("Vous n'avez pas de créneaux disponible.");
        }
    }

    FoundSlot() {
        const start = this.start.toISOString();
        const end = this.end.toISOString();
        // const start = '2019-05-09T00:00:00.000Z';
        // const end = '2019-05-09T19:23:00.000Z';

        let route_id_calendar;
        if (this.dialog_calendar_id != null) {
            route_id_calendar = this.dialog_calendar_id;
        } else {
            route_id_calendar = this.data.calendar_id;
        }
        this.toastSrv.success('Recherche de créneau en cours');
        this.calendarsSrv.findBestSlot(route_id_calendar, {
            min_time: start,
            max_time: end,
            type: this.eventType,
            location: this.location,
            duration: this.heure * 60 + this.minute,
            limit: this.limit
        }).subscribe(slots => {
                this.dialogRef.close();
                this.ChooseSlot(route_id_calendar, slots, {
                    // name: this.name,
                    type: this.eventType,
                    location: this.location,
                    // visibility: this.eventVisibility,
                    // description: this.description,
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
