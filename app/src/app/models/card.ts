import {BlockRelDeck} from './blockreldeck';

export class Card {

  public static ENABLED = 1;
  public static DISABLED = 0;
  public static BLOCKED = 2;
  public static TEXT = 1;
  public static IMAGE = 2;
  public static BLANK = 3;
  public static OPTIONS_SINGLE = 4;
  public static OPTIONS_MULTIPLE = 5;
  public static USER_CARD = 6;
  public static GLOBAL_TEXT_IMAGE = 0;
  public static GLOBAL_BLANK = 1;
  public static GLOBAL_OPTIONS = 2;
  public static GLOBAL_USER = 3;
  public static TYPES = ['', 'Text', 'Image', 'Blank', 'Options single', 'Options multiple'];
  public static TYPES_GLOBAL = ["Text/Image", "Blank card", "Options"];
  public static TYPES_EXTRA = ['', 'Text', 'Image', 'Blank', 'Options single', 'Options multiple', 'User card'];
  public static TYPES_GLOBAL_EXTRA = ["Text/Image", "Blank card", "Options", "User card"];
  
  public static CARD = 1;
  public static CARD_USER = 2;

  constructor(public id: number,
              public blockreldeck: BlockRelDeck,
              public text: string,
              public options: any,
              public flip: boolean,
              public checked: boolean,
              public status: number,
              public type: number,
              public pretype: number,
              public zIndex: number,
              public createdAt: string,
              public updatedAt: string,) {
  }

  static make(card: any = new Array()): Card {
    return new Card(
      (card.id) ? card.id : 0,
      (card.blockreldeck) ? card.blockreldeck : BlockRelDeck.make(),
      (card.text) ? card.text : '',
      (card.options) ? card.options : '',
      (card.flip) ? card.flip : false,
      (card.checked) ? card.checked : false,
      (card.status) ? card.status : Card.ENABLED,
      (card.type) ? card.type : Card.TEXT,
      (card.pretype) ? card.pretype : Card.GLOBAL_TEXT_IMAGE,
      (card.zIndex) ? card.zIndex : 1,
      (card.createdAt) ? card.createdAt : '',
      (card.updatedAt) ? card.updatedAt : '',
    );
  }

  getStatic() {
    return {
      'ENABLED': Card.ENABLED,
      'DISABLED': Card.DISABLED,
      'TEXT': Card.TEXT,
      'BLANK': Card.BLANK,
      'IMAGE': Card.IMAGE,
      'OPTIONS_MULTIPLE': Card.OPTIONS_MULTIPLE,
      'OPTIONS_SINGLE': Card.OPTIONS_SINGLE,
      'USER_CARD': Card.USER_CARD,
      'TYPES': Card.TYPES,
      'TYPES_EXTRA': Card.TYPES_EXTRA,
      'BLOCKED': Card.BLOCKED,
      'TYPES_GLOBAL': Card.TYPES_GLOBAL,
      'TYPES_GLOBAL_EXTRA': Card.TYPES_GLOBAL_EXTRA,
      'GLOBAL_TEXT_IMAGE': Card.GLOBAL_TEXT_IMAGE,
      'GLOBAL_BLANK': Card.GLOBAL_BLANK,
      'GLOBAL_OPTIONS': Card.GLOBAL_OPTIONS,
      'GLOBAL_USER': Card.GLOBAL_USER,
      'CARD': Card.CARD,
      'CARD_USER': Card.CARD_USER
    };
  }

}
