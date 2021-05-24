import {Card} from './card';
import {Relation} from './relation';


export class RelationCard {

  public static GENERAL = 1;
  public static ENABLED = 1;
  public static DISABLED = 0;
  public static DELETED = 2;

  constructor(public id: number,
              public card: Card,
              public relation: Relation,
              public type: number,
              public status: number,
              public createdAt: string,
              public updatedAt: string) {
  }

  static make(relationcard: any = new Array()): RelationCard {
    return new RelationCard(
      (relationcard.id) ? relationcard.id : 0,
      (relationcard.card) ? relationcard.card : Card.make(),
      (relationcard.relation) ? relationcard.relation : Relation.make(),
      (relationcard.type) ? relationcard.type : RelationCard.GENERAL,
      (relationcard.status) ? relationcard.status : RelationCard.ENABLED,
      (relationcard.createdAt) ? relationcard.createdAt : '',
      (relationcard.updatedAt) ? relationcard.updatedAt : '',
    );
  }

  getStatic() {
    return {
      'GENERAL': RelationCard.GENERAL,
      'ENABLED': RelationCard.ENABLED,
      'DISABLED': RelationCard.DISABLED,
      'DELETED': RelationCard.DELETED
    };
  }

}
