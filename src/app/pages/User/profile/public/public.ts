import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {RequestService} from "../../../../core/services/request.service";
import {User} from "../../../../core/models/User";
import {ProfileService} from "../../../../core/services/profile.service";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'public-profile',
    templateUrl: 'public.html',
    styleUrls: ['public.scss', '../profile.scss', '../../../../../scss/themes/main.scss']
})
export class PublicProfileComponent implements OnInit, OnDestroy {
    user_id: number;
    user: User;
    private sub: any;

    image: any = null;

    constructor(private route: ActivatedRoute,
                private profilSrv: ProfileService,
                private toastSrv: ToastrService,
                private requestSrv: RequestService) {

    }

    ngOnInit() {
        this.sub = this.route.params
            .subscribe(params => {
                this.requestSrv.get(`users/${params.name}`, {}, {Authorization: ''})
                    .subscribe(ret => {
                        this.user = ret.user;
                        this.requestSrv.get(`users/${ret.user.pseudo}/image`, {}, {Authorization: ''})
                            .subscribe(ret => this.image = ret.image);
                    });
            });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    sendInvitation() {
        console.log('user pseudo', this.user.pseudo);
        this.requestSrv.post(`users/${this.user.pseudo}/friend-invite`, {}, {Authorization: ''}).subscribe((response => {
            this.toastSrv.success("L'invitation a bien été envoyée");
        }));
    }
}