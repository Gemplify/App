import {Block} from './block';

export class Version {
  
  public static ENABLED = 1;
  public static DISABLED = 0;
  
  public static GENERAL = 1;

  constructor(public id: number,
              public block: Block,
              public name: string,
              public type: number,
              public status: number,
              public createdAt: string,
              public updatedAt: string,) {
  }

  static make(version: any = new Array()): Version {
    return new Version(
      (version.id) ? version.id : 0,
      (version.block) ? version.block : Block.make(),
      (version.name) ? version.name : '',
      (version.type) ? version.type : Version.GENERAL,
      (version.status) ? version.status : Version.ENABLED,
      (version.createdAt) ? version.createdAt : '',
      (version.updatedAt) ? version.updatedAt : '',
    );
  }

  getStatic() {
    return {
      'ENABLED': Version.ENABLED,
      'DISABLED': Version.DISABLED,
      'GENERAL': Version.GENERAL
    };
  }

}
