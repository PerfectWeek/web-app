import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import { environment } from "../../../environments/environment";

@Injectable()
export class InterceptorUrl implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const dup = req.clone({
      url: environment.url + req.url
    });
    return next.handle(dup);
  }
}
