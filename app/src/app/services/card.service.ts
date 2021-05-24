import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/index';
import {Utils} from "../libs/utils";
import {GLOBAL} from '../global';
import {User} from "../models/user";
import {Card} from '../models/card';
import {Deck} from '../models/deck';
import {Session} from '../models/session';

@Injectable()
export class CardService {

  public platform: boolean;

  public httpOptions = {
    headers: new HttpHeaders(
      {'Content-Type': 'application/x-www-form-urlencoded'}
    )
  };

  constructor(public _http: HttpClient, private _router: Router) {
  }


  getCard(): Observable<any> {
    const json = encodeURIComponent(JSON.stringify({
      'midata': 0
    }));
    // get hash
    const hash = Utils.convert(GLOBAL.api_token, new Date().getTime());
    const params = 'json=' + json + '&t=' + hash.time + '&h=' + hash.token;
    return this._http.post(GLOBAL.api + 'get/cards', params, this.httpOptions);
  }

  uploadCardsWithExcel(user: User, version: any, excel: any){

    return new Promise<any>((resolve, reject) => {

      const formData: any = new FormData();
      const xhr = new XMLHttpRequest();
      const hash = Utils.convert(GLOBAL.api_token, new Date().getTime());

      formData.append('excel', excel);
      formData.append('user', JSON.stringify(user));
      formData.append('version', JSON.stringify(version));
      formData.append('t', hash.time);
      formData.append('h', hash.token);

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };

      xhr.open('POST', GLOBAL.api + 'admin/update-cards-excel', true);
      xhr.send(formData);

    });

  }
  
  addCard(card: Card): Observable<any> {
    const json = encodeURIComponent(JSON.stringify({
      'card': card
    }));
    // get hash
    const hash = Utils.convert(GLOBAL.api_token, new Date().getTime());
    const params = 'json=' + json + '&t=' + hash.time + '&h=' + hash.token;
    return this._http.post(GLOBAL.api + 'add/card', params, this.httpOptions);
  }
  
  addCardBySession(card: Card, session: Session): Observable<any> {
    const json = encodeURIComponent(JSON.stringify({
      'card': card,
      'session': session
    }));
    // get hash
    const hash = Utils.convert(GLOBAL.api_token, new Date().getTime());
    const params = 'json=' + json + '&t=' + hash.time + '&h=' + hash.token;
    return this._http.post(GLOBAL.api + 'add/card', params, this.httpOptions);
  }
  
  updateCard(card: Card): Observable<any> {
    const json = encodeURIComponent(JSON.stringify({
      'card': card
    }));
    // get hash
    const hash = Utils.convert(GLOBAL.api_token, new Date().getTime());
    const params = 'json=' + json + '&t=' + hash.time + '&h=' + hash.token;
    return this._http.post(GLOBAL.api + 'update/card', params, this.httpOptions);
  }
  
  deleteDeckCards(decks: Deck[], cards: Card[], version: any): Observable<any> {
    const json = encodeURIComponent(JSON.stringify({
      'decks': decks,
      'cards': cards,
      'version': version
    }));
    // get hash
    const hash = Utils.convert(GLOBAL.api_token, new Date().getTime());
    const params = 'json=' + json + '&t=' + hash.time + '&h=' + hash.token;
    return this._http.post(GLOBAL.api + 'remove/decks/and/cards', params, this.httpOptions);
  }
  
  exportExcel(user: User, version: any): Observable<any> {
    const json = encodeURIComponent(JSON.stringify({
      'user': user,
      'version': version
    }));
    // get hash
    const hash = Utils.convert(GLOBAL.api_token, new Date().getTime());
    const params = 'json=' + json + '&t=' + hash.time + '&h=' + hash.token;
    return this._http.post(GLOBAL.api + 'export/version/excel', params, this.httpOptions);
  }
  
}
