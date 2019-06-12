import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {RequestService} from "../../../../core/services/request.service";
import {User} from "../../../../core/models/User";
import {ProfileService} from "../../../../core/services/profile.service";
import {ToastrService} from "ngx-toastr";
import {UsersService} from "../../../../core/services/Requests/Users";

@Component({
    selector: 'public-profile',
    templateUrl: 'public.html',
    styleUrls: ['public.scss', '../profile.scss', '../../../../../scss/themes/main.scss']
})
export class PublicProfileComponent implements OnInit, OnDestroy {
    user_id: number;
    user: User;
    private sub: any;

    displayButton: boolean = false;

    image: any = null;

    constructor(private route: ActivatedRoute,
                private profileSrv: ProfileService,
                private toastSrv: ToastrService,
                private router: Router,
                private usersSrv: UsersService,
                private requestSrv: RequestService) {

    }

    ngOnInit() {
        this.sub = this.route.params
            .subscribe(params => {
                this.profileSrv.userProfile$.subscribe(current_user => {
                    if (params.name === current_user.pseudo)
                        this.router.navigate(['profile']);
                });
                this.usersSrv.getUser(params.name)
                    .subscribe(ret => {
                            this.usersSrv.getFriendInvitationStatus(ret.user.pseudo)
                            .subscribe(res => {
                                res.status !== 'confirmed' ? this.displayButton = true : null;
                            });
                        this.user = ret.user;
                        this.usersSrv.getImage(ret.user.pseudo)
                            .subscribe(ret => this.image = ret.image);
                    });
            });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    sendInvitation() {
        this.usersSrv.inviteFriend(this.user.pseudo).subscribe((response => {
            this.toastSrv.success("L'invitation a bien été envoyée");
        }));
    }
}