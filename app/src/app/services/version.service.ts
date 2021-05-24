import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/index';
import {Utils} from "../libs/utils";
import {GLOBAL} from '../global';
import {Deck} from '../models/deck';
import {Block} from '../models/block';
import {Version} from '../models/version';

@Injectable()
export class VersionService {

  public platform: boolean;

  public httpOptions = {
    headers: new HttpHeaders(
      {'Content-Type': 'application/x-www-form-urlencoded'}
    )
  };

  constructor(public _http: HttpClient, private _router: Router) {
  }
  
  
  update(version: Version): Observable<any> {
    const json = encodeURIComponent(JSON.stringify({
      'version': version
    }));
    // get hash
    const hash = Utils.convert(GLOBAL.api_token, new Date().getTime());
    const params = 'json=' + json + '&t=' + hash.time + '&h=' + hash.token;
    return this._http.post(GLOBAL.api + 'update/version', params, this.httpOptions);
  }
  
  add(version: Version, block: Block): Observable<any> {
    const json = encodeURIComponent(JSON.stringify({
      'version': version,
      'block': block
    }));
    // get hash
    const hash = Utils.convert(GLOBAL.api_token, new Date().getTime());
    const params = 'json=' + json + '&t=' + hash.time + '&h=' + hash.token;
    return this._http.post(GLOBAL.api + 'add/version', params, this.httpOptions);
  }

}
