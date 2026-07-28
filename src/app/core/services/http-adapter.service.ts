import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpAdapterService {
  loginUrl = environment.apiUrl;
  preLoginRequest: any = {
    ReqSourceID: 'P352701804001520',
    ReqSource: 'apiManager',
    IsEmulator: 'N',
    IsBluetooth: '00:00:00:69:E7:44',
    ReqAPIV: '1.0',
    ReqSessionID: '0',
    langcode: 'en_US',
    isRootedApp: false,
  };

  constructor(private httpClient: HttpClient) {}

  sendRequest(request: any) {
    let headers = new HttpHeaders();
    headers = headers.set('key', 'key');
    return this.httpClient.post(this.loginUrl, JSON.stringify(request), {
      headers,
      responseType: 'text',
    });
  }

  responsePreChecks(response: any) {
    if (response == undefined || response == '') {
      console.error('Unauthorized access...');
      return false;
    }

    let jsoinresponse = JSON.parse(response);
    if ('ErrorMessage' in jsoinresponse) {
      if (jsoinresponse['InvalidSession'] == 'Y') {
        console.error('Session invalid:', jsoinresponse['ErrorMessage']);
        return false;
      }
    }
    return true;
  }
}
