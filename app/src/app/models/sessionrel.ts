import {Block} from './block';
import {Session} from './session';
import {Card} from './card';
import {ConfigCard} from './configcard';

export class SessionRel {
  
  public static PENDING = 1;
  public static ANSWERED = 2;
  public static DISABLED = 0;
  public static DEFAULT = 1;

  constructor(public id: number,
              public session: Session,
              public card: Card,
              public answer: any,
              public configCard: ConfigCard,
              public type: number,
              public status: number,
              public checked: boolean,
              public createdAt: string,
              public updatedAt: string,) {
  }

  static make(sessionrel: any = new Array()): SessionRel {
    return new SessionRel(
      (sessionrel.id) ? sessionrel.id : 0,
      (sessionrel.session) ? sessionrel.session : Session.make(),
      (sessionrel.card) ? sessionrel.card : Card.make(),
      (sessionrel.answer) ? sessionrel.answer : '',
      (sessionrel.configCard) ? sessionrel.configCard : ConfigCard.make(),
      (sessionrel.type) ? sessionrel.type : Block.DEFAULT,
      (sessionrel.status) ? sessionrel.status : Block.DISABLED,
      (sessionrel.checked) ? sessionrel.checked : false,
      (sessionrel.createdAt) ? sessionrel.createdAt : '',
      (sessionrel.updatedAt) ? sessionrel.updatedAt : '',
    );
  }

  getStatic() {
    return {
      'PENDING': SessionRel.PENDING,
      'ANSWERED': SessionRel.ANSWERED,
      'DISABLED': SessionRel.DISABLED,
      'DEFAULT': SessionRel.DEFAULT
    };
  }

}
