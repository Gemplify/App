import {Block} from './block';
import {Version} from './version';
import {Deck} from './deck';

export class BlockRelDeck {
  
  public static ENABLED = 1;
  public static DISABLED = 0;

  constructor(public id: number,
              public block: Block,
              public version: Version,
              public deck: Deck,
              public createdAt: string) {
  }

  static make(blockreldeck: any = new Array()): BlockRelDeck {
    return new BlockRelDeck(
      (blockreldeck.id) ? blockreldeck.id : 0,
      (blockreldeck.block) ? blockreldeck.block : Block.make(),
      (blockreldeck.version) ? blockreldeck.version : Version.make(),
      (blockreldeck.deck) ? blockreldeck.deck : Deck.make(),
      (blockreldeck.createdAt) ? blockreldeck.createdAt : ''
    );
  }

  getStatic() {
    return {
      'ENABLED': BlockRelDeck.ENABLED,
      'DISABLED': BlockRelDeck.DISABLED
    };
  }

}
