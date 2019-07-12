import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {ProfileService} from '../../../core/services/profile.service';
import {RequestService} from '../../../core/services/request.service';
import {ConfirmDialog} from '../Confirm-dialog/Confirm-dialog';
import {EventsService} from "../../../core/services/Requests/Events";

@Component({
    selector: 'event-modification-dialog',
    templateUrl: 'ModifyEvent.html',
    styleUrls: ['ModifyEvent.scss', '../../../../scss/dialog.scss']
    // styles: ['.mat-raised-button {\n' +
    // '  box-sizing: border-box;\n' +
    // '  position: relative;\n' +
    // '  -webkit-user-select: none;\n' +
    // '  -moz-user-select: none;\n' +
    // '  -ms-user-select: none;\n' +
    // '  user-select: none;\n' +
    // '  cursor: pointer;\n' +
    // '  outline: 0;\n' +
    // '  border: none;\n' +
    // '  -webkit-tap-highlight-color: transparent;\n' +
    // '  display: inline-block;\n' +
    // '  white-space: nowrap;\n' +
    // '  text-decoration: none;\n' +
    // '  vertical-align: baseline;\n' +
    // '  text-align: center;\n' +
    // '  margin: 0;\n' +
    // '  min-width: 88px;\n' +
    // '  line-height: 36px;\n' +
    // '  padding: 0 16px;\n' +
    // '  border-radius: 2px;\n' +
    // '  overflow: visible;\n' +
    // '  transform: translate3d(0, 0, 0);\n' +
    // '  transition: background .4s cubic-bezier(.25, .8, .25, 1), box-shadow 280ms cubic-bezier(.4, 0, .2, 1);\n' +
    // '  box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);\n' +
    // '}']
})
export class ModifyEventDialog {

    pw_event: {
        id: string
        name: string,
        type: string,
        location: string,
        description: string,
        visibility: string,
        backgroundColor: any,
        start: Date,
        end: Date,
        formated_start: Date,
        formated_end: Date,
    };

    event_image: any;

    eventTypes: any = [{value: 'party', viewValue: 'Fête'},
        {value: 'work', viewValue: 'Travail'},
        {value: 'hobby', viewValue: 'Loisir'},
        {value: 'workout', viewValue: 'Entrainement'}];

    eventVisibilities: any = [{value: 'public', viewValue: 'Public'},
        {value: 'private', viewValue: 'Privé'}];

    constructor(private requestSrv: RequestService,
                private profileSrv: ProfileService,
                private eventsSrv: EventsService,
                private toastSrv: ToastrService,
                public dialogRef: MatDialogRef<ModifyEventDialog>,
                public dialog: MatDialog,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.pw_event = data.event.event;

        this.eventsSrv.getImage(this.pw_event.id)
            .subscribe(ret => {
                this.event_image = ret.image;
            });

        const current_event = this.data.calAPI.getEventById(this.pw_event.id);
        this.eventsSrv.getEvent(this.pw_event.id)
            .subscribe(ret => {
                    this.pw_event.name = ret.event.name;
                    this.pw_event.type = ret.event.type;
                    this.pw_event.location = ret.event.location;
                    this.pw_event.visibility = ret.event.visibility;
                    this.pw_event.description = ret.event.description;
                    this.pw_event.formated_start = ret.event.start_time;
                    this.pw_event.formated_end = ret.event.end_time;
                },
                err => {
                    ;
                });
    }

    modifyEvent() {
        const str_end = (this.pw_event.formated_end instanceof Object) ? this.pw_event.formated_end.toISOString() : this.pw_event.formated_end;
        const str_start = (this.pw_event.formated_start instanceof Object) ? this.pw_event.formated_start.toISOString() : this.pw_event.formated_start;
        this.eventsSrv.modifyEvent(this.pw_event.id, {
            name: this.pw_event.name,
            type: this.pw_event.type,
            location: this.pw_event.location,
            visibility: this.pw_event.visibility,
            description: this.pw_event.description,
            start_time: str_start,
            end_time: str_end,
        }).subscribe(ret => {
                    const current_event = this.data.calAPI.getEventById(this.pw_event.id);
                    current_event.setProp('title', this.pw_event.name);
                    current_event.setDates(this.pw_event.formated_start,
                        this.pw_event.formated_end);
                    (<any>window).ga('send', 'event', 'Events', 'Event Modification', `Event Name: ${this.pw_event.name}`);
                    this.toastSrv.success('L\'évènement a bien été modifié');
                    this.dialogRef.close(true);
                },
                err => {
                    this.toastSrv.error('Une erreur est survenue');
                    this.dialogRef.close(false);
                });
    }

    deleteEvent() {
        const dialogSupprim = this.dialog.open(ConfirmDialog, {
            data: {
                title: 'Suppression d\'evenement',
                question: 'Voulez-vous vraiment supprimer cette evenement ?'
            }
        });

        dialogSupprim.afterClosed().subscribe(result => {
            if (result === true) {
                this.eventsSrv.deleteEvent(this.pw_event.id)
                    .subscribe(ret => {
                        (<any>window).ga('send', 'event', 'Events', 'Event Deletion', `Event Name: ${this.pw_event.name}`);
                        const current_event = this.data.calAPI.getEventById(this.pw_event.id);
                        current_event.remove();
                        this.dialogRef.close(false);
                        this.toastSrv.success('Evenement Supprimé');
                    }, ret => this.toastSrv.error('Une erreur est survenue lors de la suppression de l\'evenement'));
            }
        });
    }

    ModifyImageEvent(event) {
        if (event.target.files && event.target.files.length === 1) {
            const file = event.target.files[0];
                this.eventsSrv.uploadImage(this.pw_event.id, file)
                .do(() => {
                            this.eventsSrv.getImage(this.pw_event.id)
                            .subscribe(ret => {
                                this.event_image = ret.image;
                            });
                        this.toastSrv.success("L'image a été uploadé avec succès");
                    }, err => this.toastSrv.error("Une erreur est survenue lors de l'upload de l'image")
                ).subscribe();
        }
    }
}
