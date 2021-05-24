import {Relation} from './relation';

export class ConfigCard {

  public static FRONT = 1;
  public static BACK = 0;
  public static ENABLED = 1;
  public static DISABLED = 0;
  public static BLOCKED = 2;

  constructor(public flip: number,
              public zIndex: number,
              public status: number,
              public relation: boolean,
              public relationFocus: number,
              public image: string,
              public x: number,
              public y: number,
              public screenWidth: number,
              public screenHeight: number) {
  }

  static make(configcard: any = new Array()): ConfigCard {
    return new ConfigCard(
      (configcard.flip) ? configcard.flip : ConfigCard.BACK,
      (configcard.zIndex) ? configcard.zIndex : 1000,
      (configcard.status != null) ? configcard.status : ConfigCard.ENABLED,
      (configcard.relation != null) ? configcard.relation : false,
      (configcard.relationFocus != null) ? configcard.relationFocus : null,
      (configcard.image != null) ? configcard.image : null,
      (configcard.x) ? configcard.x : 0,
      (configcard.y) ? configcard.y : 0,
      (configcard.screenWidth) ? configcard.screenWidth : 0,
      (configcard.screenHeight) ? configcard.screenHeight : 0
    );
  }

  getStatic() {
    return {
      'FRONT': ConfigCard.FRONT,
      'BACK': ConfigCard.BACK
    };
  }

}
