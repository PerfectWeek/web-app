import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {RequestService} from "../../../../core/services/request.service";
import {User} from "../../../../core/models/User";

@Component({
    selector: 'public-profile',
    templateUrl: 'public.html',
    styleUrls: ['public.scss', '../../../../../scss/themes/main.scss']
})
export class PublicProfileComponent implements OnInit, OnDestroy {
    user_id: number;
    user: User;
    private sub: any;

    constructor(private route: ActivatedRoute,
                private requestSrv: RequestService) {

    }

    ngOnInit() {
        this.sub = this.route.params
            .subscribe(params => {
                this.requestSrv.get(`users/${params.name}`, {}, {Authorization: ''})
                    .subscribe(ret => {
                        this.user.pseudo = ret.user.pseudo;
                    });
            });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}