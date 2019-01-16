import {Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit} from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent, CalendarEventTitleFormatter,
  CalendarView,
  DAYS_OF_WEEK
} from 'angular-calendar';

import {RequestService} from "../../core/services/request.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {ProfileService} from "../../core/services/profile.service";
import {FormModalComponent} from "./demo-utils/ModalForm/form-modal.component";
import {MatDialog} from "@angular/material";
import {CreateEventDialog} from "../../module/dialog/CreateEvent-dialog/CreateEvent-dialog";
import {CustomEventTitleFormatter} from "./demo-utils/custom-event-title-formatter.provider";
import {formatDate} from "@angular/common";
import {ModifyEventDialog} from "../../module/dialog/ModifyEvent-dialog/ModifyEvent";
import {ConfirmDialog} from "../../module/dialog/Confirm-dialog/Confirm-dialog";

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
  templateUrl: 'calendar.html',
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter
    }
  ]
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

  is_global_calendar: boolean = true;
  date_format: string = "yyyy-MM-ddThh:mm:ss";

  // private modal: NgbModal,
  constructor(private modal: NgbModal, public dialog: MatDialog,
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
      onClick: ({event}: { event: CalendarEvent }): void => {
        this.eventModification(event);
        //this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({event}: { event: CalendarEvent }): void => {
        //this.events = this.events.filter(iEvent => iEvent !== event);
        //this.handleEvent('Deleted', event);
        this.deleteEvent(event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  events: PerfectWeekCalendarEvent[] = [];

  activeDayIsOpen: boolean = true;
  calendar_id: number = null;
  calendar_name: string = null;

  get_calendar_events(calendar_id): void {
    this.requestSrv.get(`calendars/${calendar_id}/events`, {}, {Authorization: ''})
      .subscribe(resp => {
        let random_color = {
          primary: '#' + (Math.random() * 0xFFFFFF << 0).toString(16),
          secondary: '#1C4891',
        };
        for (const idx in resp.events) {
          this.requestSrv.get(`events/${resp.events[idx].id}`, {}, {Authorization: ''})
            .subscribe(ret => {
              this.events.push({
                description: ret.event.description,
                location: ret.event.location,
                id: ret.event.id,
                title: ret.event.name,
                start: startOfDay(ret.event.start_time),
                end: endOfDay(ret.event.end_time),
                color: random_color,
                draggable: true,
                actions: this.actions,
                resizable: {
                  beforeStart: true,
                  afterEnd: true
                }
              });
              this.refresh.next();
            });
        }
      });
  }

  // get_calendar_events(calendar_id): void {
  //   this.requestSrv.get(`calendars/${calendar_id}/events`, {}, {Authorization: ''})
  //     .subscribe(ret => {
  //       let random_color = {
  //         primary: '#'+(Math.random() * 0xFFFFFF << 0).toString(16),
  //         secondary: '#1C4891',
  //       };
  //       for (const idx in ret.events) {
  //         this.events.push({
  //           description: ret.events[idx].description,
  //           location: ret.events[idx].location,
  //           id: ret.events[idx].id,
  //           title: ret.events[idx].name,
  //           start: startOfDay(ret.events[idx].start_time),
  //           end: endOfDay(ret.events[idx].end_time),
  //           color: random_color,
  //           draggable: true,
  //           actions: this.actions,
  //           resizable: {
  //             beforeStart: true,
  //             afterEnd: true
  //           }
  //         });
  //         this.refresh.next();
  //       }
  //     });
  // }


  get_group_calendar(): void {
    this.get_calendar_events(this.calendar_id);
    this.requestSrv.get(`calendars/${this.calendar_id}`, {}, {Authorization: ''})
      .subscribe(ret => {
        this.calendar_name = ret.calendar.name;
        console.log('aclendar_name => ', this.calendar_name)
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

  get_group_info() {
    this.calendar_id = +(this.router.url.slice(this.router.url.lastIndexOf('/') + 1));
    if (!Number.isNaN(this.calendar_id)) {
      this.is_global_calendar = false;
      this.get_group_calendar();
    } else {
      this.is_global_calendar = true;
      this.get_global_calendar();
    }
  }

  dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {
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
    console.log(modified_event);
    this.requestSrv.put(`events/${event.id}`, {
        start_time: formatDate(newStart, this.date_format, this.locale),
        end_time: formatDate(newEnd, this.date_format, this.locale),
        location: modified_event.location,
        description: modified_event.description,
        name: modified_event.title
      },
      {Authorization: ''})
      .subscribe(ret => {
        event.start = newStart;
        event.end = newEnd;
        this.refresh.next();
        this.toastSrv.success("Evenement modifié");
      });
  }

  handleEvent(action: string, event: CalendarEvent): void {
    //this.modalData = { event, action };
    //this.modal.open(this.modalContent, { size: 'lg' });
    //this.modal.open(FormModalComponent, { size: 'lg' });
  }

  // modify all fields
  eventModification(event): void {
    let dialogRef = this.dialog.open(ModifyEventDialog, {
      data: {
        event,
        calendar_locale: this.locale,
        refresh: this.refresh,
      }
    });
    // let modified_event = this.events.find(current_event => current_event.id === event.id);
    // console.log(modified_event);
    // this.requestSrv.put(`events/${event.id}`, {start_time: formatDate(newStart, this.date_format, this.locale),
    //     end_time: formatDate(newEnd, this.date_format, this.locale),
    //     location: modified_event.location,
    //     description: modified_event.description,
    //     name: modified_event.title},
    //   {Authorization: ''})
    //   .subscribe(ret => {
    //     event.start = newStart;
    //     event.end = newEnd;
    //     this.refresh.next();
    //   });
  }

  addEvent(): void {
    let dialogRef = this.dialog.open(CreateEventDialog, {
      data: {
        calendar_id: this.calendar_id,
        actions: this.actions,
        events: this.events,
        refresh: this.refresh,
        is_global_calendar: this.is_global_calendar,
        calendar_locale: this.locale,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== null && result !== undefined) {
        console.log("Event created")
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
    this.modal.open(FormModalComponent, {size: 'lg'});
    this.refresh.next();
  }

  deleteEvent(elem): void {
    let dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: "Suppression d'evenement",
        question: 'Voulez-vous vraiment supprimer cette evenement ?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        let event_id;

        if (typeof elem === 'number') {
          event_id = elem;
        } else {
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
    });
  }
}
