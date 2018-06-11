import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class RequestService {

  static prepareHeader(value: any): HttpHeaders {
    let httpHeader = new HttpHeaders();

    for (const key in value) {
      httpHeader = httpHeader.append(key, value[key]);
    }

    return httpHeader;
  }

  constructor(private http: HttpClient) {

  }

  static prepareParams(params: any): HttpParams {
    let httpParam = new HttpParams();

    for (const key in params) {
      httpParam = httpParam.append(key, params[key]);
    }

    return httpParam;
  }


  get(url: string, params?: any, headers?: any): Observable<any> {

    const httpParam = RequestService.prepareParams(params);
    const httpHeader = (RequestService.prepareHeader(headers)).append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.get(url, {
      params: httpParam,
      headers: httpHeader
    });

  }

  post(url: string, body: any, headers?: any): Observable<any> {
    const httpHeaders = (RequestService.prepareHeader(headers)).append('Content-Type', 'application/x-www-form-urlencoded');
    const params = RequestService.prepareParams(body);

    console.log('params => ', params.toString());

    console.log('header => ', httpHeaders);

    return this.http.post(url, params, {
        headers: httpHeaders
      }
    );
  }


  put(url: string, body: any, headers?: any): Observable<any> {
    const httpHeaders = (RequestService.prepareHeader(headers)).append('Content-Type', 'application/x-www-form-urlencoded');
    const params = RequestService.prepareParams(body);

    return this.http.put(url, params, {
        headers: httpHeaders
      }
    );
  }

  delete(url: string, headers?: any): Observable<any> {
    const httpHeaders = (RequestService.prepareHeader(headers)).append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.delete(url, {
      headers: httpHeaders
    });
  }

}
