import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { DemoUtilsModule } from '../demo-utils/module';
import { DemoComponent } from './app.component';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

@NgModule({
  imports: [
    CommonModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    DragAndDropModule,
    DemoUtilsModule
  ],
  declarations: [DemoComponent],
  exports: [DemoComponent]
})
export class DemoModule {}
