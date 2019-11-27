import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {ProfileService} from '../../../core/services/profile.service';
import {RequestService} from '../../../core/services/request.service';
import {ConfirmDialog} from '../Confirm-dialog/Confirm-dialog';
import {EventsService} from '../../../core/services/Requests/Events';
import {PermissionService} from '../../../core/services/permission.service';
import {EventTypeService} from '../../../core/services/event_type.service';
import {Location} from '@angular/common';

import frLocale from 'flatpickr/dist/l10n/fr.js';
import enLocale from 'flatpickr/dist/l10n/uk.js';
import {ActivatedRoute} from '@angular/router';

import * as imageUtils from "../../../core/helpers/image"

@Component({
    selector: 'event-modification-dialog',
    templateUrl: 'ModifyEvent.html',
    styleUrls: ['ModifyEvent.scss', '../../../../scss/dialog.scss']
})
export class ModifyEventDialog implements OnInit, OnDestroy {

    pw_event: {
        id: string
        name: string,
        type: string,
        location: string,
        description: string,
        visibility: string,
        backgroundColor: string,
        start: Date,
        end: Date,
        formated_start: Date,
        formated_end: Date,
    } = {
        id: null,
        name: null,
        type: null,
        location: null,
        description: null,
        visibility: null,
        backgroundColor: null,
        start: null,
        end: null,
        formated_end: null,
        formated_start: null
    };

    locale = frLocale.fr;
    event_image: any;

    is_picture_changed: boolean = false;
    image_path: any;

    //share_url = null;
    share_url = 'https://perfect-week.pw';

    eventVisibilities: any = [{value: 'public', viewValue: 'Public'},
        {value: 'private', viewValue: 'Privé'}];

    share_str = "Je vais à l\'évènement ";

    constructor(private requestSrv: RequestService,
                private profileSrv: ProfileService,
                private eventsSrv: EventsService,
                private toastSrv: ToastrService,
                public PermSrv: PermissionService,
                public eventTypeSrv: EventTypeService,
                private location: Location,
                public dialogRef: MatDialogRef<ModifyEventDialog>,
                public dialog: MatDialog,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        console.log('data => ', data);
        this.eventsSrv.getImage(data.event.event.id)
            .subscribe(image => {
                let obj = {image: null};
                imageUtils.createImageFromBlob(image, obj);
                setTimeout(() => {this.event_image = obj.image;}, 50);
            });

        const current_event = this.data.calAPI.getEventById(data.event.event.id);
        this.eventsSrv.getEvent(data.event.event.id)
            .subscribe(ret => {
                this.pw_event.id = ret.event.id;
                this.pw_event.name = ret.event.name;
                this.pw_event.type = ret.event.type;
                this.pw_event.location = ret.event.location;
                this.pw_event.visibility = ret.event.visibility;
                this.pw_event.description = ret.event.description;
                this.pw_event.formated_start = ret.event.start_time;
                this.pw_event.formated_end = ret.event.end_time;
                this.pw_event.backgroundColor = ret.event.color;
                },
                err => console.log("err => ", err.message));
        if (data.locale === 'fr') {
            this.locale = frLocale.fr;
        }
        else if (data.locale === 'en') {
            this.locale = enLocale.en;
        }
        else {
            this.locale = frLocale.fr;
        }
    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {
        //this.location.replaceState('/dashboard');
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
            color: this.pw_event.backgroundColor
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

        //upload de la PP
        if (this.is_picture_changed === true) {
            this.eventsSrv.uploadImage(this.pw_event.id, this.image_path)
                .do(() => {
                    }, err => this.toastSrv.error("Une erreur est survenue lors de l'upload de l'image")
                ).subscribe();
        }
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
            this.image_path = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (event:any) => {
                this.event_image = event.target.result;
                this.is_picture_changed = true;
            };
            reader.readAsDataURL(event.target.files[0]);

            // this.eventsSrv.uploadImage(this.pw_event.id, file)
            //     .do(() => {
            //                 this.eventsSrv.getImage(this.pw_event.id)
            //                 .subscribe(ret => {
            //                     this.event_image = ret.image;
            //                     console.log("apres", this.event_image);
            //                 });
            //             this.toastSrv.success("L'image a été uploadé avec succès");
            //         }, err => this.toastSrv.error("Une erreur est survenue lors de l'upload de l'image")
            //     ).subscribe();
        }
    }
}
