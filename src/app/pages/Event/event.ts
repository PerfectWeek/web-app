import {AfterViewInit, Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {EventsService} from '../../core/services/Requests/Events';
import {EventTypeService} from '../../core/services/event_type.service';
import {Event, NavigationEnd, Router} from '@angular/router';

@Component({
    selector: 'eventComponent',
    templateUrl: 'event.html',
    styleUrls: ['event.scss', '../../../scss/dialog.scss']
})
export class EventComponent  implements OnInit, AfterViewInit {

    event_image: any;

    // pw_event: {
    //     name: string,
    //     type: string,
    //     location: string,
    //     description: string,
    //     visibility: string,
    //     backgroundColor: any,
    //     start: Date,
    //     end: Date,
    //     formated_start: Date,
    //     formated_end: Date,
    // };


    name: string = "";
    type: string = "hobby";
    location: string = "";
    description: string = "";
    visibility: string = "private";
    backgroundColor: any = "#ffffff";
    start: Date = new Date();
    end: Date = new Date();
    formated_start: Date = new Date();
    formated_end: Date = new Date();
    id = null;
    eventVisibilities: any = [{value: 'public', viewValue: 'Public'},
                              {value: 'private', viewValue: 'Privé'}];

    share_url = null;

    constructor(private eventsSrv: EventsService,
                public eventTypeSrv: EventTypeService,
                public router: Router) {
        setTimeout( () => {
            this.id = this.router.url.slice(this.router.url.lastIndexOf('/') + 1);
            this.share_url = `https://app.perfect-week.pw/event/${this.id}`;
            this.eventsSrv.getImage(this.id)
                .subscribe(ret => {
                    this.event_image = ret.image;
                });
            this.eventsSrv.getEvent(this.id)
                .subscribe(ret => {
                        // this.pw_event = ret;
                        this.name = ret.event.name;
                        console.log("dleodleodleodleode", ret.event.type);
                        this.type = ret.event.type;
                        this.location = ret.event.location;
                        this.visibility = ret.event.visibility;
                        this.description = ret.event.description;
                        this.formated_start = ret.event.start_time;
                        this.formated_end = ret.event.end_time;
                    },
                    err => {
                        ;
                    });
        }, 500);
        // // setTimeout(() => {
        // this.eventsSrv.getImage(this.pw_event.id)
        //     .subscribe(ret => {
        //         this.event_image = ret.image;
        //     });
        // this.eventsSrv.getEvent("298")
        //     .subscribe(ret => {
        //             console.log("apslapslasp", ret)
        //             this.pw_event.name = ret.event.name;
        //             this.pw_event.type = ret.event.type;
        //             this.pw_event.location = ret.event.location;
        //             this.pw_event.visibility = ret.event.visibility;
        //             this.pw_event.description = ret.event.description;
        //             this.pw_event.formated_start = ret.event.start_time;
        //             this.pw_event.formated_end = ret.event.end_time;
        //         },
        //         err => {
        //             ;
        //         });
        // console.log("lol", this.pw_event);
        // console.log(this.pw_event);
        // }, 500);
    }

    ngAfterViewInit(): void {
        // console.log("rebook", this.pw_event);
    }

    ngOnInit(): void {
        // this.id = this.current_url.slice(this.current_url.lastIndexOf('/') + 1);

        // console.log("aller");
        // this.router.events.subscribe((event: Event) => {
        //     console.log("je suis fatigué");
        //     if (event instanceof NavigationEnd ) {
        //         // this.current_url = event.url;
        //         console.log("ce language est null", event.url);
        //     }
        // });
    }
}
