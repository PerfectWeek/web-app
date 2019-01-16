import { LOCALE_ID, Inject } from '@angular/core';
import { CalendarEventTitleFormatter, CalendarEvent } from 'angular-calendar';
import { DatePipe } from '@angular/common';

export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {
  constructor(@Inject(LOCALE_ID) private locale: string) {
    super();
  }
  date_format: string = "dd-MM-yy HH:mm";
  // you can override any of the methods defined in the parent class

  month(event: CalendarEvent): string {
    return `<b>${new DatePipe(this.locale).transform(
      event.start,
      this.date_format,
      this.locale
    )} au 
    ${new DatePipe(this.locale).transform(
      event.end,
      this.date_format,
      this.locale
    )}</b> ${event.title}`;
  }

  week(event: CalendarEvent): string {
    return `<b>${new DatePipe(this.locale).transform(
      event.start,
      this.date_format,
      this.locale
    )} au 
    ${new DatePipe(this.locale).transform(
      event.end,
      this.date_format,
      this.locale
    )}</b> ${event.title}`;
  }

  day(event: CalendarEvent): string {
    return `<b>${new DatePipe(this.locale).transform(
      event.start,
      this.date_format,
      this.locale
    )} au 
    ${new DatePipe(this.locale).transform(
      event.end,
      this.date_format,
      this.locale
    )}</b> ${event.title}`;
  }
}
