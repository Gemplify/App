import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/index';
import {Utils} from "../libs/utils";
import {GLOBAL} from '../global';
import {User} from "../models/user";
import {Pref} from "../models/pref";

@Injectable()
export class UserService {

  public platform: boolean;

  public httpOptions = {
    headers: new HttpHeaders(
      {'Content-Type': 'application/x-www-form-urlencoded'}
    )
  };

  constructor(public _http: HttpClient, private _router: Router) {
  }

  isLogin(): User {
    const data = Pref.get(Pref.USER);
    let user = null;
    if (data) {
      user = new User(data.id, data.email, data.password, data.name, data.surname, data.lastLogin, data.status, data.type, data.updatedAt, data.createdAt);
    }
    return user;
  }

  logout(router: Router) {
    Pref.remove(Pref.USER);
    router.navigate(['admin/login']);
  }

  loginAdmin(user: User): Observable<any> {
    const json = encodeURIComponent(JSON.stringify({
      'user': user
    }));
    // get hash
    const hash = Utils.convert(GLOBAL.api_token, new Date().getTime());
    const params = 'json=' + json + '&t=' + hash.time + '&h=' + hash.token;
    return this._http.post(GLOBAL.api + 'admin/login', params, this.httpOptions);
  }


}
