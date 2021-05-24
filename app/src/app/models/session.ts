import {Version} from './version';
import {Block} from './block';
import {SessionRel} from './sessionrel';

export class Session {
  
  public static DISABLED = 0;
  public static PENDING = 1;
  public static REVIEW = 2;
  public static DEFAULT = 1;
  public static STATUS = ['Disabled', 'Pending', 'Review'];

  constructor(public id: number,
              public version: Version,
              public name: string,
              public description: string,
              public share: string,
              public expiration: string,
              public type: number,
              public status: number,
              public checked: boolean,
              public answers: SessionRel[],
              public createdAt: string,
              public updatedAt: string,) {
  }

  static make(session: any = new Array()): Session {
    return new Session(
      (session.id) ? session.id : 0,
      (session.version) ? session.version : Version.make(),
      (session.name) ? session.name : '',
      (session.description) ? session.description : '',
      (session.share) ? session.share : '',
      (session.expiration) ? session.expiration : '',
      (session.type) ? session.type : Block.DEFAULT,
      (session.status) ? session.status : Block.DISABLED,
      (session.checked) ? session.checked : false,
      (session.answers) ? session.answers : [],
      (session.createdAt) ? session.createdAt : '',
      (session.updatedAt) ? session.updatedAt : '',
    );
  }

  getStatic() {
    return {
      'PENDING': Session.PENDING,
      'REVIEW': Session.REVIEW,
      'DISABLED': Session.DISABLED,
      'DEFAULT': Session.DEFAULT,
      'STATUS': Session.STATUS
    };
  }

}
