import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/index';
import {Utils} from "../libs/utils";
import {GLOBAL} from '../global';
import {User} from "../models/user";
import {Card} from '../models/card';
import {Deck} from '../models/deck';
import {Relation} from '../models/relation';
import {RelationCard} from '../models/relation_card';
import {Version} from '../models/version';

@Injectable()
export class RelationService {

  public platform: boolean;

  public httpOptions = {
    headers: new HttpHeaders(
      {'Content-Type': 'application/x-www-form-urlencoded'}
    )
  };

  constructor(public _http: HttpClient, private _router: Router) {
  }
  
  saveRelation(relation: Relation, relationcards: RelationCard[]): Observable<any> {
    const json = encodeURIComponent(JSON.stringify({
      'relation': relation,
      'relationcards': relationcards
    }));
    // get hash
    const hash = Utils.convert(GLOBAL.api_token, new Date().getTime());
    const params = 'json=' + json + '&t=' + hash.time + '&h=' + hash.token;
    return this._http.post(GLOBAL.api + 'save/relation', params, this.httpOptions);
  }
  
  removeRelation(relation: Relation): Observable<any> {
    const json = encodeURIComponent(JSON.stringify({
      'relation': relation
    }));
    // get hash
    const hash = Utils.convert(GLOBAL.api_token, new Date().getTime());
    const params = 'json=' + json + '&t=' + hash.time + '&h=' + hash.token;
    return this._http.post(GLOBAL.api + 'remove/relation', params, this.httpOptions);
  }
  
  getRelationsFromVersion(version: Version): Observable<any> {
    const json = encodeURIComponent(JSON.stringify({
      'version': version
    }));
    // get hash
    const hash = Utils.convert(GLOBAL.api_token, new Date().getTime());
    const params = 'json=' + json + '&t=' + hash.time + '&h=' + hash.token;
    return this._http.post(GLOBAL.api + 'get/relations/from/version', params, this.httpOptions);
  }
  
  
  
}
