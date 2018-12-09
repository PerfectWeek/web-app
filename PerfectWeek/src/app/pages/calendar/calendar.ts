import {Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit} from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';

import {RequestService} from "../../core/services/request.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {Group} from "../../core/models/Group";
import {ProfileService} from "../../core/services/profile.service";

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
  styleUrls: ['calendar.scss'],
  templateUrl: 'calendar.html'
})
export class CalendarComponent implements OnInit {
  @ViewChild('modalContent')
  modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  constructor(private modal: NgbModal,
              private requestSrv: RequestService,
              private profileSrv: ProfileService,
              private toastSrv: ToastrService,
              // private dialog: MatDialog,
              private router: Router) {
  }

  ngOnInit(): void {
    this.get_group_info();
  }

  actions: CalendarEventAction[] = [
    /*{
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },*/
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
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

  get_calendar_events(calendar_id): void {
    this.requestSrv.get(`calendars/${calendar_id}/events`, {}, {Authorization: ''})
      .subscribe(ret => {
        console.log(ret);
        for (let idx in ret.events) {
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
  });
}

  get_personal_calendar (): void {
    this.profileSrv.userProfile$.subscribe(user => {
      this.requestSrv.get(`users/${user.pseudo}/calendars`, {}, {Authorization: ''})
        .subscribe(ret => {
        for (let idx in ret.calendars) {
          // si cette ligne est decomenter
          // this.get_calendar_events(ret.calendars[idx].calendar.id);
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
    this.modalData = { event, action };
    //this.modal.open(this.modalContent, { size: 'lg' });
  }

  eventModification(): void {
    console.log("Modification done");
    this.refresh.next();
  }

  addEvent(): void {
    this.requestSrv.post(`calendars/${this.calendar_id}/events`,{
      name: 'Default name form Event',
      description: 'Default description form Event',
      location: 'Default description from Event',
      start_time: startOfDay(new Date()),
      end_time: startOfDay(new Date())}, {Authorization: ''})
      .subscribe(ret => {
        this.events.push({
          title: '',
          description: '',
          location: '',
          start: startOfDay(new Date()),
          end: endOfDay(new Date()),
          color: colors.perfectweek,
          draggable: true,
          actions: this.actions,
          resizable: {
            beforeStart: true,
            afterEnd: true
          },
          id: ret.event.id,
        });
        this.refresh.next();
        this.toastSrv.success("Evenement ajouté au groupe");
      },err => this.toastSrv.error("Une erreur est survenue lors de l'ajout du nouvel evenement"))
  }
  deleteEvent(index): void {
    console.log("index", index);
    console.log("mdr", this.events[index]);
    this.requestSrv.delete(`events/${this.events[index].id}`, {Authorization: ''})
    .subscribe(ret => {
      this.toastSrv.success("Evenement Supprimé");
      this.events.splice(index, 1);
      this.refresh.next();
    }, ret => this.toastSrv.error("Une erreur est survenue lors de la suppression de l'evenement"))
  }
}
