import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { TokenService } from "../services/token.service";
import { AutthService } from "../services/auth.service";
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/throw';

@Injectable()
export class InterceptorToken implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.headers.has('Authorization')) {
      return next.handle(this.fillToken(req))
        .catch((err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              return this.authService.connection()
                .switchMap(() => next.handle(this.fillToken(req)));
            } else {
              return Observable.throwError(err);
            }
          }
        });
    }
    return next.handle(req);
  }

  fillToken(req: HttpRequest<any>): HttpRequest<any> {
    const dup = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${this.tokenSrv.token}`)
    });
    return (dup);
  }

  constructor(private tokenSrv: TokenService,
              private authService: AutthService) {

  }

}
