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

    // for (const key in params) {
    //   httpParam = httpParam.append(key, params[key]);
    // }
      for (const key in params) {
        if (params != undefined && params[key] != undefined && params[key].constructor === Array)
          params[key].forEach(val => httpParam = httpParam.append(`${key}[]`, val));
        else
          httpParam = httpParam.append(key, params[key]);
      }
    return httpParam;
  }


  get(url: string, params?: any, headers?: any): Observable<any> {

    const httpParam = RequestService.prepareParams(params);
    const httpHeader = (RequestService.prepareHeader(headers)).append('Content-Type', 'application/json');

    return this.http.get(url, {
      params: httpParam,
      headers: httpHeader
    });

  }

  getImage(url: string, params?: any, headers?:any): Observable<Blob> {
    const httpParam = RequestService.prepareParams(params);
    const httpHeader = (RequestService.prepareHeader(headers)).append('Content-Type', 'image/jpeg');

    return this.http.get(url, {
      params: httpParam,
      headers: httpHeader,
      responseType: 'blob'
    });
  }

  postJSON(url: string, body: any, headers?: any): Observable<any> {
      const httpHeaders = (RequestService.prepareHeader(headers)).append('Content-Type', 'application/json');

      return this.http.post(url, body, {
              headers: httpHeaders
          }
      );

  }

  post(url: string, body: any, headers?: any): Observable<any> {
    const httpHeaders = (RequestService.prepareHeader(headers)).append('Content-Type', 'application/json');
    const params = RequestService.prepareParams(body);

    return this.http.post(url, params, {
        headers: httpHeaders
      }
    );
  }

  putImage(url: string, file, headers?: any): Observable<any> {
      let input = new FormData();
      input.append("image", file);
      return this.http.put(url, input, {
        headers: headers
      });
  }


  put(url: string, body: any, headers?: any): Observable<any> {
    const httpHeaders = (RequestService.prepareHeader(headers)).append('Content-Type', 'application/json');

    return this.http.put(url, body, {
        headers: httpHeaders,
      }
    );
  }

  delete(url: string, headers?: any): Observable<any> {
    const httpHeaders = (RequestService.prepareHeader(headers)).append('Content-Type', 'application/json');

    return this.http.delete(url, {
      headers: httpHeaders
    });
  }

}
