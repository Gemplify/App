import {Version} from './version';

export class Relation {

  public static USER = 1;
  public static ADMIN = 2;
  public static ENABLED = 1;
  public static DISABLED = 0;

  constructor(public id: number,
              public version: Version,
              public name: string,
              public description: string,
              public type: number,
              public status: number,
              public createdAt: string,
              public updatedAt: string) {
  }

  static make(relation: any = new Array()): Relation {
    return new Relation(
      (relation.id) ? relation.id : 0,
      (relation.version) ? relation.version : Version.make(),
      (relation.name) ? relation.name : '',
      (relation.description) ? relation.description : '',
      (relation.type) ? relation.type : Relation.ADMIN,
      (relation.status) ? relation.status : Relation.ENABLED,
      (relation.createdAt) ? relation.createdAt : '',
      (relation.updatedAt) ? relation.updatedAt : '',
    );
  }

  getStatic() {
    return {
      'USER': Relation.USER,
      'ADMIN': Relation.ADMIN,
      'ENABLED': Relation.ENABLED,
      'DISABLED': Relation.DISABLED
    };
  }

}
