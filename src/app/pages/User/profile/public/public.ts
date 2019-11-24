import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {RequestService} from "../../../../core/services/request.service";
import {User} from "../../../../core/models/User";
import {ProfileService} from "../../../../core/services/profile.service";
import {ToastrService} from "ngx-toastr";
import {UsersService} from "../../../../core/services/Requests/Users";
import * as imageUtils from "../../../../core/helpers/image";
import {InvitationsService} from "../../../../core/services/Requests/Invitations";

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

    constructor(private route: ActivatedRoute,
                private profileSrv: ProfileService,
                private toastSrv: ToastrService,
                private invitationSrv: InvitationsService,
                private router: Router,
                private usersSrv: UsersService,
                private requestSrv: RequestService) {

    }

    ngOnInit() {
        this.sub = this.route.params
            .subscribe(params => {
                this.profileSrv.userProfile$.subscribe(current_user => {
                    if (params.id === current_user.id)
                        this.router.navigate(['profile']);
                });
                this.usersSrv.getUser(params.id)
                    .subscribe(ret => {
                        this.invitationSrv.getFriends()
                        .subscribe(res => {
                            let found = res.received.filter(invitation => invitation.id === this.user.id);
                            found = (found.length === 0) ?  res.sent.filter(invitation => invitation.user.id === this.user.id) : found;
                            (found.length === 0 || found[0].confirmed === 'true') ? this.displayButton = true : null;
                        });
                        this.user = ret.user;
                        this.usersSrv.getImage(ret.user.id)
                            .subscribe(ret => {
                                imageUtils.createImageFromBlob(ret, this.user);
                            }, err => console.log('err => ', err.message));
                    });
            });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    sendInvitation() {
        this.invitationSrv.inviteFriend(this.user.id).subscribe((response => {
            this.toastSrv.success("L'invitation a bien été envoyée");
        }));
    }
}