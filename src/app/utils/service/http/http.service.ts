import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

interface HeaderInterface {
  key: string;
  value: string;
}

@Injectable({ providedIn: "root" })
export class HttpService {
  private baseUrl: String = environment.baseUrl;
  public isLoggingOut: boolean = false;

  constructor(protected http: HttpClient) {}

  /**
   * get api call
   */
  getRequest(url: String, params?: Object, headerArr?: Array<HeaderInterface>): any {
    let headers = this.getHeaders(headerArr);
    const reqOps = {
      headers: headers,
      params: this.setParameters(params)
    };
    return this.http.get<any>(`${this.baseUrl}/${url}`, reqOps);
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
        let key = headerObj["key"];
        let value = headerObj["value"];
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
          obj[key].forEach(item => {
            params = params.append(`${key.toString()}[]`, JSON.stringify(item));
          });
        } else if (obj[key] !== undefined && obj[key] !== null) {
          params = params.append(key, obj[key]);
        }
      }
    }
    return params;
  }

  /**
   * Function to return common headers
   * @return headers Object
   */
  getCommonHeaders() {
    let headers = new HttpHeaders();
    headers = headers.set("accept-version", "1.0.1");
    headers = headers.set("Cache-Control", "no-cache");
    headers = headers.set("Pragma", "no-cache");
    headers = headers.set("web-version", "not-found");
    return headers;
  }

  /**
   * api call for post request
   */
  postRequest(url: String, body: Object, headerArr?: Array<HeaderInterface>, params?: Object): any {
    let headers = this.getHeaders(headerArr);
    let reqOps = {
      headers: headers,
      params: this.setParameters(params)
    };
    if (url.includes("login") || url.includes("request/switchentity")) {
      reqOps["observe"] = "response" as "response";
    }
    return this.http.post<any>(`${this.baseUrl}/${url}`, body, reqOps);
  }

  /**
   *
   * @param url (url)
   * @param body (body)
   * @param params (params)
   * @param headerArr
   * api call for put request
   */
  putRequest(url: String, body: Object, params?: Object, headerArr?: Array<HeaderInterface>): any {
    let headers = this.getHeaders(headerArr);
    let reqOps = {
      headers: headers,
      observe: "response" as "response",
      params: this.setParameters(params)
    };
    return this.http.put<any>(`${this.baseUrl}/${url}`, body, reqOps);
  }
}
