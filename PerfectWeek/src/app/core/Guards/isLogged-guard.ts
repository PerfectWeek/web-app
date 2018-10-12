import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {ToastrService} from "ngx-toastr";

@Injectable()
export class isLogged implements CanActivate {

  constructor(private authSrv: AuthService,
              private router: Router,
              private toastSrv: ToastrService) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return (this.authSrv.isLogged()
      .do((data: boolean) => {
        if (data === false) {
          this.toastSrv.error("Vous devez être connecté", "Erreur");
          this.router.navigate(['/login'])
        }
      }))
  }
}
