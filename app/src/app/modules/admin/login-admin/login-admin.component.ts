import { Component, OnInit } from '@angular/core';
import {User} from "../../../models/user";
import {UserService} from "../../../services/user.service";
import {Pref} from "../../../models/pref";
import {Router} from "@angular/router";


@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.scss'],
  providers: [UserService]
})
export class LoginAdminComponent implements OnInit {

  user: User;
  error: any;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.user = this.userService.isLogin();
    if(this.user){
      this.router.navigate(['admin/block-manager']);
    }else{
      this.user = User.make();
    }
    this.error = {
      status: false,
      msg: 'Ha ocurrido un error'
    }
  }

  submitLogin(){

    this.error.status = false;

    if (this.user.email !== '' && this.user.password !== ''){

      this.userService.loginAdmin(this.user).subscribe(
        result => {
          if (result.code === 200) {

            //seteamos user de bbdd
            let user = User.make(result.user);
            this.user = user;

            //guardamos la sesión de usuario
            Pref.set(Pref.USER, this.user);
            this.router.navigate(['admin/block-manager']);

          } else {
            this.error.status = true;
            this.error.msg = result.message;
            console.log(result.message);
          }

        },
        error => {
          this.error.status = true;
          console.log(<any> error);
        }
      );
    }else{
      this.error.status = true;
      this.error.msg = 'El email y contraseña son obligatorios.';
    }

  }

}
