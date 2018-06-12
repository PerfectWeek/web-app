import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { TokenService } from "../services/token.service";
import { AuthService } from "../services/auth.service";
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/throw';

@Injectable()
export class InterceptorToken implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.headers.has('access-token')) {
      return next.handle(this.fillToken(req))
        .catch((err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              return this.authService.connection()
                .switchMap(() => next.handle(this.fillToken(req)));
            } else {
              return Observable.throw(err);
            }
          }
        });
    }
    return next.handle(req);
  }

  fillToken(req: HttpRequest<any>): HttpRequest<any> {
    const dup = req.clone({
      headers: req.headers.set('access-token', `${this.tokenSrv.token}`)
    });
    return (dup);
  }

  constructor(private tokenSrv: TokenService,
              private authService: AuthService) {

  }

}
