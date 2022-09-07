import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ToastService } from '../service/toaster.service'

interface HeaderInterface {
  key: string;
  value: string;
}

@Injectable()
export class HttpService {

  private baseUrl: String = environment.baseUrl;
  public isLoggingOut: boolean = false;

  constructor(
    protected http: HttpClient,
    private toastService: ToastService
  ) { }

  /**
   * get api call
   */
   getRequest(url: String, params?: Object, headerArr?: Array<HeaderInterface>): any {
    let headers = this.getHeaders(headerArr);
    const reqOps = {
      headers: headers,
      params: this.setParameters(params)
    };
    return this.requestInterceptor(this.http.get<any>(`${this.baseUrl}/${url}`, reqOps), 'get');
  }

  /**
   * Function to Add Custom Headers and return it
   * @param headerArr Array<Object>
   * @return headers Object
   */
   getHeaders(headerArr?: Array<HeaderInterface>) {
    let headers = this.getCommonHeaders();
    if (headerArr) {
      headerArr.forEach(headerObj => {
        let key = headerObj['key'];
        let value = headerObj['value'];
        headers.set(key, value);
      });
    }
    return headers;
  }

  setParameters(obj: Object) {
    let params = new HttpParams();
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] instanceof Array) {
          obj[key].forEach((item) => {
            params = params.append(`${key.toString()}[]`, JSON.stringify(item));
          });
        } else if (obj[key] !== undefined && obj[key] !== null){
          params = params.append(key, obj[key]);
        }
      }
    }
    return params;
  }

  private requestInterceptor(observable: any, requestType?: string) {
    if (!navigator.onLine) {
      this.toastService.showToaster();
      setTimeout(() => {
        this.toastService.hideToaster();
      }, 5000);
    }

    return observable
  }

    /**
   * Function to return common headers
   * @return headers Object
   */
     getCommonHeaders() {
      let headers = new HttpHeaders();
      headers = headers.set('accept-version', '1.0.1');
      headers = headers.set('Cache-Control', 'no-cache');
      headers = headers.set('Pragma', 'no-cache');
      headers = headers.set('web-version', 'not-found');
      return headers;
    }

}
