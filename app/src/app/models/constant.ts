export class Constant {

  public static DECK = 1;
  public static BLOCK = 2;
  public static SESSION = 3;

  constructor() {
  }

  getStatic() {
    return {
      'DECK': Constant.DECK,
      'BLOCK': Constant.BLOCK,
      'SESSION': Constant.SESSION
    };
  }

}
