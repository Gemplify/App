export class Block {
  
  public static ENABLED = 1;
  public static DISABLED = 0;
  public static DEFAULT = 1;

  constructor(public id: number,
              public text: string,
              public slug: string,
              public checked: boolean,
              public type: number,
              public status: number,
              public createdAt: string,
              public updatedAt: string,) {
  }

  static make(block: any = new Array()): Block {
    return new Block(
      (block.id) ? block.id : 0,
      (block.text) ? block.text : '',
      (block.slug) ? block.slug : '',
      (block.checked) ? block.checked : false,
      (block.type) ? block.type : Block.DEFAULT,
      (block.status) ? block.status : Block.DISABLED,
      (block.createdAt) ? block.createdAt : '',
      (block.updatedAt) ? block.updatedAt : '',
    );
  }

  getStatic() {
    return {
      'ENABLED': Block.ENABLED,
      'DISABLED': Block.DISABLED,
      'DEFAULT': Block.DEFAULT
    };
  }

}
