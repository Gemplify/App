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
export class BlockService {

  public platform: boolean;

  public httpOptions = {
    headers: new HttpHeaders(
      {'Content-Type': 'application/x-www-form-urlencoded'}
    )
  };

  constructor(public _http: HttpClient, private _router: Router) {
  }
  
  getBlocks(): Observable<any> {
    const json = encodeURIComponent(JSON.stringify({
    }));
    // get hash
    const hash = Utils.convert(GLOBAL.api_token, new Date().getTime());
    const params = 'json=' + json + '&t=' + hash.time + '&h=' + hash.token;
    return this._http.post(GLOBAL.api + 'get/blocks', params, this.httpOptions);
  }
  
  getBlocksRel(): Observable<any> {
    const json = encodeURIComponent(JSON.stringify({
    }));
    // get hash
    const hash = Utils.convert(GLOBAL.api_token, new Date().getTime());
    const params = 'json=' + json + '&t=' + hash.time + '&h=' + hash.token;
    return this._http.post(GLOBAL.api + 'get/blocks/rel', params, this.httpOptions);
  }
  
  getBlocksByDeck(deck: Deck): Observable<any> {
    const json = encodeURIComponent(JSON.stringify({
      'deck': deck
    }));
    // get hash
    const hash = Utils.convert(GLOBAL.api_token, new Date().getTime());
    const params = 'json=' + json + '&t=' + hash.time + '&h=' + hash.token;
    return this._http.post(GLOBAL.api + 'get/blocks/by/deck', params, this.httpOptions);
  }
  
  getBlocksByText(text: string): Observable<any> {
    const json = encodeURIComponent(JSON.stringify({
      'text': text
    }));
    // get hash
    const hash = Utils.convert(GLOBAL.api_token, new Date().getTime());
    const params = 'json=' + json + '&t=' + hash.time + '&h=' + hash.token;
    return this._http.post(GLOBAL.api + 'get/blocks/by/text', params, this.httpOptions);
  }
  
  deleteBlocks(blocks: Block[]): Observable<any> {
    const json = encodeURIComponent(JSON.stringify({
      'blocks': blocks
    }));
    // get hash
    const hash = Utils.convert(GLOBAL.api_token, new Date().getTime());
    const params = 'json=' + json + '&t=' + hash.time + '&h=' + hash.token;
    return this._http.post(GLOBAL.api + 'delete/blocks', params, this.httpOptions);
  }
  
  saveBlock(version: Version, decks: Deck[]): Observable<any> {
    const json = encodeURIComponent(JSON.stringify({
      'version': version,
      'decks': decks
    }));
    // get hash
    const hash = Utils.convert(GLOBAL.api_token, new Date().getTime());
    const params = 'json=' + json + '&t=' + hash.time + '&h=' + hash.token;
    return this._http.post(GLOBAL.api + 'save/block', params, this.httpOptions);
  }
  
  saveDecksFromBlock(version: any, decks: Deck[]): Observable<any> {
    const json = encodeURIComponent(JSON.stringify({
      'version': version,
      'decks': decks
    }));
    // get hash
    const hash = Utils.convert(GLOBAL.api_token, new Date().getTime());
    const params = 'json=' + json + '&t=' + hash.time + '&h=' + hash.token;
    return this._http.post(GLOBAL.api + 'save/decks/from/block', params, this.httpOptions);
  }
  
  update(block: Block): Observable<any> {
    const json = encodeURIComponent(JSON.stringify({
      'block': block
    }));
    // get hash
    const hash = Utils.convert(GLOBAL.api_token, new Date().getTime());
    const params = 'json=' + json + '&t=' + hash.time + '&h=' + hash.token;
    return this._http.post(GLOBAL.api + 'update/block', params, this.httpOptions);
  }

}
