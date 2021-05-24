export class User {

  public static DISABLED = 0;
  public static ENABLED = 1;
  public static ADMIN = 0;
  public static USER = 1;

  constructor(public id: number,
              public email: string,
              public password: string,
              public name: string,
              public surname: string,
              public lastLogin: any,
              public status: number,
              public type: number,
              public updatedAt: any,
              public createdAt: any) {
  }

  static make(user: any = new Array()): User {
    return new User(
      (user.id) ? user.id : 0,
      (user.email) ? user.email : '',
      (user.password) ? user.password : '',
      (user.name) ? user.name : '',
      (user.surname) ? user.surname : '',
      (user.lastLogin) ? user.lastLogin : '',
      (user.status) ? user.status : User.DISABLED,
      (user.type) ? user.type : User.ADMIN,
      (user.updatedAt) ? user.updatedAt : '',
      (user.createdAt) ? user.createdAt : ''
    );
  }

  getStatic() {
    return {
      'DISABLED': User.DISABLED,
      'ENABLED': User.ENABLED,
      'ADMIN': User.ADMIN,
      'USER': User.USER
    };
  }

}
