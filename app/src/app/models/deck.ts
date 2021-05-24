export class Deck {

  public static ENABLED = 1;
  public static DISABLED = 0;

  constructor(public id: number,
              public text: string,
              public slug: string,
              public checked: boolean,
              public createdAt: string,
              public updatedAt: string,) {
  }

  static make(deck: any = new Array()): Deck {
    return new Deck(
      (deck.id) ? deck.id : 0,
      (deck.text) ? deck.text : '',
      (deck.slug) ? deck.slug : '',
      (deck.checked) ? deck.checked : false,
      (deck.createdAt) ? deck.createdAt : '',
      (deck.updatedAt) ? deck.updatedAt : '',
    );
  }

  getStatic() {
    return {
      'ENABLED': Deck.ENABLED,
      'DISABLED': Deck.DISABLED
    };
  }

}
