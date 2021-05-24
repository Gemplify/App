
export class PositionCard {

  constructor(public x: number,
              public y: number) {
  }

  static make(positioncard: any = new Array()): PositionCard {
    return new PositionCard(
      (positioncard.x) ? positioncard.x : 0,
      (positioncard.y) ? positioncard.y : 0,
    );
  }

}
