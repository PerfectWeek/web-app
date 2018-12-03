import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';

import {
  isSameDay,
  isSameMonth
 } from 'date-fns'
import { Subject } from 'rxjs';
import { colors } from '../demo-utils/colors';

@Component({
  selector: 'mwl-demo-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'app.component.html',
  styles: [
    `
      .drag-active {
        position: relative;
        z-index: 1;
        pointer-events: none;
      }
      .drag-over {
        background-color: #eee;
      }
    `
  ]
})

export class DemoComponent {
  CalendarView = CalendarView;

  view = CalendarView.Month;

  viewDate = new Date();

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        //
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);

      }
    }
  ];

  externalEvents: CalendarEvent[] = [
    {
      title: 'Event 1',
      color: colors.yellow,
      start: new Date(),
      actions: this.actions,
      draggable: true,
    },
    {
      title: 'Event 2',
      color: colors.blue,
      start: new Date(),
      actions: this.actions,
      draggable: true
    },
    {
      title: 'Event test 7',
      color: colors.red,
      start: new Date(),
      actions: this.actions,
      draggable: true
    },
    {
      title: 'Event test 8',
      color: colors.yellow,
      start: new Date(),
      actions: this.actions,
      draggable: true
    }
  ];

  events: CalendarEvent[] = [
    {
      title: 'Event 3',
      color: colors.red,
      start: new Date("2018-12-02"),
      actions: this.actions,
      draggable: true,
    },
    {
      title: 'Event 5',
      color: colors.red
,      start: new Date("2018-12-31"),
      actions: this.actions,
      draggable: true,
    },
    {
      title: 'Event 6',
      color: colors.yellow,
      start: new Date("2018-12-19"),
      actions: this.actions,
      draggable: true,
    }
  ];

  activeDayIsOpen = false;

  refresh = new Subject<void>();

  eventDropped({
    event,
    newStart,
    newEnd,
    allDay
  }: CalendarEventTimesChangedEvent): void {
    const externalIndex = this.externalEvents.indexOf(event);
    if (typeof allDay !== 'undefined') {
      event.allDay = allDay;
    }
    if (externalIndex > -1) {
      this.externalEvents.splice(externalIndex, 1);
      this.events.push(event);
    }
    event.start = newStart;
    if (newEnd) {
      event.end = newEnd;
    }
    if (this.view === 'month') {
      this.viewDate = newStart;
      this.activeDayIsOpen = true;
    }
    this.events = [...this.events];
  }

  externalDrop(event: CalendarEvent) {
    if (this.externalEvents.indexOf(event) === -1) {
      this.events = this.events.filter(iEvent => iEvent !== event);
      this.externalEvents.push(event);
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
}
