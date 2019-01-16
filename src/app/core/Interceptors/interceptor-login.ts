import {EventEmitter, Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http";

@Injectable()
export class InterceptorLogin implements HttpInterceptor{
  currentAsk: Observable<any>;
  eventEmitter = new EventEmitter<any>();

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.search("login") == -1 || req.method != "POST") {
      return next.handle(req);
    }
    if (this.currentAsk != null) {
      return this.eventEmitter;
    }
    this.currentAsk = next.handle(req);
    return this.currentAsk
      .do(event => {
        if (event instanceof HttpResponse) {
          this.currentAsk = null;
          this.eventEmitter.emit(event);
        }
      },() => {
        this.currentAsk = null;
        this.eventEmitter.error("error");
      });
  }

}
