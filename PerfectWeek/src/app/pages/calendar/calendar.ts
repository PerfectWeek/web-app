import {Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit} from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
  DAYS_OF_WEEK
} from 'angular-calendar';

import {RequestService} from "../../core/services/request.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {ProfileService} from "../../core/services/profile.service";
import {FormModalComponent} from "./demo-utils/ModalForm/form-modal.component";
import {int} from "flatpickr/dist/utils";
import {MatDialog} from "@angular/material";
import {ConfirmDialog} from "../../module/dialog/Confirm-dialog/Confirm-dialog";
import {CreateEventDialog} from "../../module/dialog/CreateEvent-dialog/CreateEvent-dialog";
import {GroupCreationDialog} from "../../module/dialog/Group-creation-dialog/group-creation";

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  },
  perfectweek: {
    primary: '#5ABC95',
    secondary: '#1C4891',
    //secondary: '#FDF1BA'
  }
};

export class PerfectWeekCalendarEvent implements CalendarEvent {
  public id: number;
  public description: string;
  public location: string;
  public title: string;
  public start: Date;
  public end: Date;
  public color: any;
  public draggable: boolean;
  public actions: CalendarEventAction[];
  public resizable: any;
}

@Component({
  selector: 'mwl-demo-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['calendar.scss', '../../../scss/themes/main.scss'],
  templateUrl: 'calendar.html'
})
export class CalendarComponent implements OnInit {
  @ViewChild('modalContent')
  modalContent: TemplateRef<any>;

  // FRENCH CALENDAR
  locale: string = 'fr';
  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;
  weekendDays: number[] = [DAYS_OF_WEEK.FRIDAY, DAYS_OF_WEEK.SATURDAY];

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  // private modal: NgbModal,
  constructor(private modal: NgbModal,public dialog: MatDialog,
              private requestSrv: RequestService,
              private profileSrv: ProfileService,
              private toastSrv: ToastrService,
              // private dialog: MatDialog,
              private router: Router) {
  }

  ngOnInit(): void {
    console.log("ngOnInit Calendar");
    this.get_group_info();
  }

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        //this.events = this.events.filter(iEvent => iEvent !== event);
        //this.handleEvent('Deleted', event);
        this.deleteEvent(event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  // events: CalendarEvent[] = [
  events: PerfectWeekCalendarEvent[] = [
    /*{
      start: addHours(startOfDay(new Date()), 2),
      end: new Date(),
      title: 'A draggable and resizable event',
      color: colors.yellow,
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
    }*/
  ];

  activeDayIsOpen: boolean = true;
  calendar_id: number = null;
  calendar_name: string = null;

  // get_calendar_events(calendar_id): void {
  //   this.requestSrv.get(`calendars/${calendar_id}/events`, {}, {Authorization: ''})
  //     .subscribe(resp => {
  //       for (const idx in resp.events) {
  //         this.requestSrv.get(`events/${resp.events[idx].id}`, {}, {Authorization: ''})
  //           .subscribe(ret => {
  //             // console.log("ENORME", `events/${resp.events[idx].id}`);
  //             // console.log("PTDR", ret);
  //             this.events.push({
  //               description: ret.event.description,
  //               location: ret.event.location,
  //               id: ret.event.id,
  //               title: ret.event.name,
  //               start: startOfDay(ret.event.start_time),
  //               end: endOfDay(ret.event.end_time),
  //               color: colors.perfectweek,
  //               draggable: true,
  //               actions: this.actions,
  //               resizable: {
  //                 beforeStart: true,
  //                 afterEnd: true
  //               }
  //             });
  //             this.refresh.next();
  //           });
  //       }
  //     });
  // }

  get_calendar_events(calendar_id): void {
    this.requestSrv.get(`calendars/${calendar_id}/events`, {}, {Authorization: ''})
      .subscribe(ret => {
        for (const idx in ret.events) {
          this.events.push({
            description: ret.events[idx].description,
            location: ret.events[idx].location,
            id: ret.events[idx].id,
            title: ret.events[idx].name,
            start: startOfDay(ret.events[idx].start_time),
            end: endOfDay(ret.events[idx].end_time),
            color: colors.perfectweek,
            draggable: true,
            actions: this.actions,
            resizable: {
              beforeStart: true,
              afterEnd: true
            }
          });
          this.refresh.next();
        }
      });
  }


  get_group_calendar(): void {
    this.get_calendar_events(this.calendar_id);
  this.requestSrv.get(`calendars/${this.calendar_id}`, {}, {Authorization: ''})
  .subscribe(ret => {
  this.calendar_name = ret.calendar.name;
  console.log('aclendar_name => ', this.calendar_name)
  });
}

  get_personal_calendar (): void {
    this.profileSrv.userProfile$.subscribe(user => {
      this.requestSrv.get(`users/${user.pseudo}/calendars`, {}, {Authorization: ''})
        .subscribe(ret => {
        for (let idx in ret.calendars) {
          // si cette ligne est decomenter
          this.get_calendar_events(ret.calendars[idx].calendar.id);
          // ca fou la merde sur le dashboard
        }
      });
    });
  }

  get_group_info() {
      this.calendar_id = +(this.router.url.slice(this.router.url.lastIndexOf('/') + 1));
      // console.log("calendar ID", this.calendar_id);
      if (!Number.isNaN(this.calendar_id)) {
        // console.log("CA PASSE PAR LA");
        this.get_group_calendar();
      } else {
        this.get_personal_calendar();
      }
    }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  eventTimesChanged({
                      event,
                      newStart,
                      newEnd,
                    }: CalendarEventTimesChangedEvent): void {
      let modified_event = this.events.find(current_event => current_event.id === event.id);
      this.requestSrv.put(`events/${event.id}`, {start_time: newStart,
                                                            end_time: newEnd,
                                                            description: modified_event.description},
                                                            {Authorization: ''})
      .subscribe(ret => {
        event.start = newStart;
        event.end = newEnd;
        this.handleEvent('Dropped or resized', event);
        this.refresh.next();
      });
  }

  handleEvent(action: string, event: CalendarEvent): void {
    //this.modalData = { event, action };
    //this.modal.open(this.modalContent, { size: 'lg' });
    //this.modal.open(FormModalComponent, { size: 'lg' });
  }

  eventModification(): void {
    console.log("Modification done");
    this.refresh.next();
  }

  addEvent(): void {
    let dialogRef = this.dialog.open(CreateEventDialog, {
      data: {
        calendar_id: this.calendar_id,
        actions: this.actions,
        events: this.events,
        refresh: this.refresh,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== null && result !== undefined) {
        // this.requestSrv.post(`calendars/${this.calendar_id}/events`,{
        //   name: 'lol',
        //   description: 'Default description form Event',
        //   location: 'Default description from Event',
        //   start_time: startOfDay(new Date()),
        //   end_time: startOfDay(new Date())}, {Authorization: ''})
        //   .subscribe(ret => {
        //     this.events.push({
        //       title: '',
        //       description: '',
        //       location: '',
        //       start: startOfDay(new Date()),
        //       end: endOfDay(new Date()),
        //       color: colors.perfectweek,
        //       draggable: true,
        //       actions: this.actions,
        //       resizable: {
        //         beforeStart: true,
        //         afterEnd: true
        //       },
        //       id: ret.event.id,
        //     });
        //     this.refresh.next();
        //     this.toastSrv.success("Evenement ajouté au groupe");
        //   },err => this.toastSrv.error("Une erreur est survenue lors de l'ajout du nouvel evenement"))
      console.log("OK")
      }
    });

    // let dialogRef = this.dialog.open(CreateEventDialog, {
    //   data: {
    //     title: "Creation d'évenement",
    //     //question: 'Voulez-vous vraiment supprimer votre profil ?'
    //   }
    // });
  }

  createEvent(): void {
    //this.addEvent();
    //this.handleEvent('Create event', event);
    this.modal.open(FormModalComponent, { size: 'lg' });
    this.refresh.next();
  }

  deleteEvent(elem): void {
    let event_id;

    console.log("elem", elem);
    console.log("mdr", this.events[elem]);
    if (typeof elem === 'number') {
      event_id = elem;
    }
    else {
      event_id = elem.id;
    }
    this.requestSrv.delete(`events/${event_id}`, {Authorization: ''})
    .subscribe(ret => {
      this.toastSrv.success("Evenement Supprimé");

      if (typeof elem === 'number') {
        this.events.splice(elem, 1);
      } else {
        this.events = this.events.filter(iEvent => iEvent !== elem);
      }
      this.refresh.next();
    }, ret => this.toastSrv.error("Une erreur est survenue lors de la suppression de l'evenement"))
  }
}
