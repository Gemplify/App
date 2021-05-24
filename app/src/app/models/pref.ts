export class Pref {

  static USER = 'user';
  static COOKIES = 'cookies';

  constructor(){

  }

  static get(name: string){
    return JSON.parse(window.localStorage.getItem(name));
  }

  static set(name: string, data: any){
    window.localStorage.setItem(name, JSON.stringify(data));
  }

  static remove(name: string){
    window.localStorage.removeItem(name);
  }
  
}
