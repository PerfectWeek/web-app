import {Component, Inject, Input, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {ProfileService} from '../../../core/services/profile.service';
import {RequestService} from '../../../core/services/request.service';
import {OptionsInput} from '@fullcalendar/core/types/input-types';
import {FullCalendarComponent} from '@fullcalendar/angular';
import {EventInput} from '@fullcalendar/core/structs/event';
import {Calendar} from '@fullcalendar/core/Calendar';
import timeGridPlugin from '@fullcalendar/timegrid';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import frLocale from '@fullcalendar/core/locales/fr';
import esLocale from '@fullcalendar/core/locales/es';
import {CreateEventDialog} from '../CreateEvent-dialog/CreateEvent-dialog';

@Component({
    selector: 'FoundSlotConfirm-dialog',
    templateUrl: 'FoundSlotConfirm-dialog.html',
    styleUrls: ['../../../../scss/dialog.scss', 'FoundSlotConfirm-dialog.scss'],
})
export class FoundSlotConfirmDialog {
    calendars_list: any;
    index: number = 0;
    location: string = '';
    dialog_calendar_id: string = null;
    id_of_suggest_event: string = "42";
    best_slot_name = "Meilleur créneau";

    @ViewChild('userInput') userInput;

    constructor(private requestSrv: RequestService,
                private profileSrv: ProfileService,
                private toastSrv: ToastrService,
                public dialogRef: MatDialogRef<FoundSlotConfirmDialog>,
                public dialog: MatDialog,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.profileSrv.userProfile$.subscribe(user => {
            this.requestSrv.get(`users/${user.pseudo}/calendars`, {}, {Authorization: ''})
                .subscribe(ret => {
                    this.calendars_list = ret.calendars;
                });
        });
    }

    FoundSlotConfirm() {
        const route_id_calendar = (this.dialog_calendar_id != null) ? this.dialog_calendar_id : this.data.calendar_id;
        if (this.index === undefined) {
            this.index = 0;
        }
        this.dialogRef.close();
        const start = this.data.slots.slots[this.index].start_time;
        const end = this.data.slots.slots[this.index].end_time;
        const dialogConfirmRef = this.dialog.open(CreateEventDialog, {
            width: '1300px',
            data: {
                calendar_id: route_id_calendar,
                is_global_calendar: false,
                calendar_locale: this.locale,
                event: {
                    id: this.data.event.id,
                    type: this.data.event.type,
                    title: this.data.event.name,
                    location: this.data.event.location,
                    description: this.data.event.description,
                    start: new Date(start),
                    end: new Date(end)
                },
                calAPI: this.data.calAPI_
            }
        });
        dialogConfirmRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result !== null && result !== undefined) {
                console.log('Réponse enregistré');
            }
        });
        // const start = this.data.slots.slots[this.index].start_time;
        // const end = this.data.slots.slots[this.index].end_time;
        // //console.log(this.data.slots.slots[this.index]);
        // this.requestSrv.post(`calendars/${route_id_calendar}/events`, {
        //     name: this.data.event.name,
        //     type: this.data.event.type,
        //     location: this.data.event.location,
        //     description: this.data.event.description,
        //     visibility: this.data.event.visibility,
        //     start_time: start,
        //     end_time: end
        // }, {Authorization: ''})
        //     .subscribe(ret => {
        //         this.data.calAPI_.addEvent({
        //             id: ret.event.id,
        //             type: this.data.event.type,
        //             title: this.data.event.name,
        //             visibility: this.data.event.visibility,
        //             location: this.data.event.location,
        //             description: this.data.event.description,
        //             start: new Date(start),
        //             end: new Date(end),
        //         });
        //         this.toastSrv.success('Evenement ajouté au groupe');
        //         this.dialogRef.close();
        //     }, err => this.toastSrv.error('Une erreur est survenue lors de l\'ajout du nouvel evenement'));
    }

    Before(): void {
        if (this.index > 0) {
            this.index--;
            console.log(this.slot[this.index]);
            const previous_suggest_event = this.api.getEventById(this.id_of_suggest_event);
            if (previous_suggest_event !== null) {
                previous_suggest_event.remove();
            }
            this.api.addEvent({
                id: this.id_of_suggest_event,
                start: this.slot[this.index].start_time,
                end: this.slot[this.index].end_time,
                // title: this.temp_event.name,
                title: this.best_slot_name,
                backgroundColor: '#FAA401',
                borderColor: '#1C4891',
            });
            this.api.gotoDate(this.slot[this.index].start_time);
            const tmp_date = new Date(this.slot[this.index].start_time);
            this.cursor = (tmp_date.getHours() - 4 >= 0 ? tmp_date.getHours() - 4 : 0) + ':00:00';
            this.api.setOption('ScrollTime', this.cursor);
            setTimeout(() => {
                // CEST DEGEULASSE
                this.api.changeView('timeGridDay');
                this.api.changeView('timeGridWeek');
            }, 10);
        }
        console.log('this.index', this.index);
    }

    After(): void {
        console.log('After');
        if (this.index < this.slot.length - 1) {
            this.index++;
            const previous_suggest_event = this.api.getEventById(this.id_of_suggest_event);
            if (previous_suggest_event !== null) {
                previous_suggest_event.remove();
            }
            this.api.addEvent({
                id: this.id_of_suggest_event,
                start: this.slot[this.index].start_time,
                end: this.slot[this.index].end_time,
                title: this.best_slot_name,
                backgroundColor: '#FAA401',
                borderColor: '#1C4891',
            });
            this.api.gotoDate(this.slot[this.index].start_time);
            const tmp_date = new Date(this.slot[this.index].start_time);
            this.cursor = (tmp_date.getHours() - 4 >= 0 ? tmp_date.getHours() - 4 : 0) + ':00:00';
            this.api.setOption('ScrollTime', this.cursor);

            setTimeout(() => {
                // CEST DEGEULASSE
                this.api.changeView('timeGridDay');
                this.api.changeView('timeGridWeek');
            }, 10);
        }
            console.log('this.index', this.index);
    }

    ////////////////////////////////////////////////////////////

    options: OptionsInput;
    @ViewChild('fullcalendar') calendarComponent: FullCalendarComponent;
    events: EventInput[] = [];
    locale: 'fr';
    api: Calendar;
    cursor: string;

    // @Input() slot: any;
    // @Input() temp_event: any;
    slot: any;
    temp_event: any;

    ngOnInit() {

        // this.temp_event = JSON.parse(this.temp_event);
        // this.slot = JSON.parse(this.slot);
        this.temp_event = this.data.event;
        this.slot = this.data.slots.slots;
        // console.log('alors', this.slot);
        // console.log('alors', this.index);
        // console.log('alors', this.slot[this.index]);
        const tmp_date = new Date(this.slot[this.index].start_time);
        console.log('tmp_date', tmp_date);
        this.cursor = (tmp_date.getHours() - 4) + ':00:00';
        console.log('cursor', this.cursor);
        this.options = {
            editable: false,
            plugins: [timeGridPlugin, bootstrapPlugin],
            defaultView: 'timeGridWeek',
            locales: [esLocale, frLocale],
            locale: frLocale,
            buttonIcons: false,
            weekNumbers: true,
            navLinks: true,
            eventLimit: true,
            themeSystem: 'bootstrap',
        };
        setTimeout(() => {
            this.api = this.calendarComponent.getApi();
            this.api.addEvent({
                id: this.id_of_suggest_event,
                start: this.slot[this.index].start_time,
                end: this.slot[this.index].end_time,
                title: this.best_slot_name,
                backgroundColor: '#FAA401',
                borderColor: '#1C4891',
            });
            this.api.updateSize();
            this.api.gotoDate(this.slot[this.index].start_time);
            console.log('scrollTime', this.api.getOption('ScrollTime'));
            this.get_global_calendar();
        }, 500);
    }

    get_calendar_events(calendar_id) {
        this.requestSrv.get(`calendars/${calendar_id}/events`, {}, {Authorization: ''})
            .subscribe(ret => {
                const hexa = ['#3d8fdc'];
                const backgroundColor_ = hexa[Math.floor(Math.random() * hexa.length)];
                // const backgroundColor_ = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
                const borderColor_ = '#1C4891';
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

    get_global_calendar(): void {
        this.profileSrv.userProfile$.subscribe(user => {
            this.requestSrv.get(`users/${user.pseudo}/calendars`, {}, {Authorization: ''})
                .subscribe(ret => {
                    for (let idx in ret.calendars) {
                        this.get_calendar_events(ret.calendars[idx].calendar.id);
                    }
                });
        });
    }
}
