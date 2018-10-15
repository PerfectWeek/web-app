import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {ToastrService} from "ngx-toastr";

@Injectable()
export class IsLogout implements CanActivate {

  constructor(private authSrv: AuthService,
              private toastSrv: ToastrService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authSrv.isLogged()
      .map((state: boolean) => !state)
      .do((state: boolean) => {
        if (state === false) {
          this.toastSrv.info("Vous êtes déjà connecté", "Info");
          this.router.navigate(['/dashboard'])
        }
      })
  }
}
