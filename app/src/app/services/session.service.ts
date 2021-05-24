import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/index';
import {Utils} from "../libs/utils";
import {GLOBAL} from '../global';
import {User} from "../models/user";
import {Card} from '../models/card';
import {Deck} from '../models/deck';
import {Version} from '../models/version';
import {Session} from '../models/session';

@Injectable()
export class SessionService {

  public platform: boolean;

  public httpOptions = {
    headers: new HttpHeaders(
      {'Content-Type': 'application/x-www-form-urlencoded'}
    )
  };

  constructor(public _http: HttpClient, private _router: Router) {
  }
  
  getSessionsForVersion(version: Version): Observable<any> {
    const json = encodeURIComponent(JSON.stringify({
      'version': version
    }));
    // get hash
    const hash = Utils.convert(GLOBAL.api_token, new Date().getTime());
    const params = 'json=' + json + '&t=' + hash.time + '&h=' + hash.token;
    return this._http.post(GLOBAL.api + 'get/sessions/from/version', params, this.httpOptions);
  }
  
  getSessionById(id: number): Observable<any> {
    const json = encodeURIComponent(JSON.stringify({
      'id': id
    }));
    // get hash
    const hash = Utils.convert(GLOBAL.api_token, new Date().getTime());
    const params = 'json=' + json + '&t=' + hash.time + '&h=' + hash.token;
    return this._http.post(GLOBAL.api + 'get/session/by/id', params, this.httpOptions);
  }
  
  getSessionByIdAndShare(id: number, share: string): Observable<any> {
    const json = encodeURIComponent(JSON.stringify({
      'id': id,
      'share': share
    }));
    // get hash
    const hash = Utils.convert(GLOBAL.api_token, new Date().getTime());
    const params = 'json=' + json + '&t=' + hash.time + '&h=' + hash.token;
    return this._http.post(GLOBAL.api + 'get/session/by/id/and/share', params, this.httpOptions);
  }
  
  saveSession(session: Session): Observable<any> {
    const json = encodeURIComponent(JSON.stringify({
      'session': session
    }));
    // get hash
    const hash = Utils.convert(GLOBAL.api_token, new Date().getTime());
    const params = 'json=' + json + '&t=' + hash.time + '&h=' + hash.token;
    return this._http.post(GLOBAL.api + 'save/session', params, this.httpOptions);
  }
  
  updateSession(session: Session): Observable<any> {
    const json = encodeURIComponent(JSON.stringify({
      'session': session
    }));
    // get hash
    const hash = Utils.convert(GLOBAL.api_token, new Date().getTime());
    const params = 'json=' + json + '&t=' + hash.time + '&h=' + hash.token;
    return this._http.post(GLOBAL.api + 'update/session', params, this.httpOptions);
  }
  
  saveSessionUser(list: any[]): Observable<any> {
    const json = encodeURIComponent(JSON.stringify({
      'list': list
    }));
    // get hash
    const hash = Utils.convert(GLOBAL.api_token, new Date().getTime());
    const params = 'json=' + json + '&t=' + hash.time + '&h=' + hash.token;
    return this._http.post(GLOBAL.api + 'save/session/from/user', params, this.httpOptions);
  }
  
  getSessionsByText(text: string, version: Version): Observable<any> {
    const json = encodeURIComponent(JSON.stringify({
      'text': text,
      'version': version
    }));
    // get hash
    const hash = Utils.convert(GLOBAL.api_token, new Date().getTime());
    const params = 'json=' + json + '&t=' + hash.time + '&h=' + hash.token;
    return this._http.post(GLOBAL.api + 'get/sessions/by/text', params, this.httpOptions);
  }
  
  shareUrl(session: Session): Observable<any> {
    const json = encodeURIComponent(JSON.stringify({
      'session': session
    }));
    // get hash
    const hash = Utils.convert(GLOBAL.api_token, new Date().getTime());
    const params = 'json=' + json + '&t=' + hash.time + '&h=' + hash.token;
    return this._http.post(GLOBAL.api + 'update/share/url', params, this.httpOptions);
  }
  
}
