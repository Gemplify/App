import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../services/user.service";
import {User} from "../../../models/user";
import {Router} from "@angular/router";
import {CardService} from "../../../services/card.service";
import {Deck} from "../../../models/deck";
import {Card} from "../../../models/card";

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss'],
  providers: [UserService, CardService]
})
export class DashboardAdminComponent implements OnInit {

  user: User;
  excel: any = null;
  load: boolean;
  list: any[] = [];

  constructor(private userService: UserService, private cardService: CardService, private router: Router) { }

  ngOnInit() {
    this.user = this.userService.isLogin();

    if (this.user == null || (!this.user && this.user.type === User.ADMIN)) {
      this.router.navigate(['admin/login']);
    }
    this.getCards();
  }

  getCards(){ /* LLAMA AL SERVICIO PARA CONSEGUIR LAS CARTAS ALMACENADAS EN BBDD */

    this.cardService.getCard().subscribe(

      result => {
        //console.log(result);
        if (result.code === 200) {
          this.setInitCards(result.list); /* CREA EL ARRAY CON LOS OBJETOS CARTAS */
        } else {
          console.log(result.message);
        }
      },
      error => {
        console.log(<any> error);
      }

    );

  }

  setInitCards(list: any[]){

    list.forEach(item =>{
      let deck = Deck.make(item.deck);
      let cards = [];
      item.cards.forEach(card =>{
        let c = Card.make(card);
        let res = c.options.replace(/<>/g, ',');
        c.options = res;

        cards.push(c);
      })
      this.list.push({
        'deck': deck,
        'cards': cards
      });

    });

  }

  uploadExcel(){


    this.load = true;

    if(this.excel != null){

      /*this.cardService.uploadCardsWithExcel(this.user, this.excel).then((result) => {
        if (result.code === 200) {
          this.setCards(result.list);
        } else {
          console.log(result.msg);
        }
        this.load = false;
      }, (error) => {
        this.load = false;
        console.log(error);
      });*/


    }else{
      this.load = false;
      console.log('Debes especificar un curso y subir el excel tipo.');
    }

    (<HTMLInputElement>document.getElementById('excel')).value = '';

  }

  setCards(list: any[]){

    let list_local = [];

    list.forEach(item =>{

      let deck = Deck.make(item.deck);
      let card = Card.make(item.card);
      let res = card.options.replace(/<>/g, ',');
      card.options = res;

      let control = false;

      list_local.forEach(item_local =>{
        if(item_local.deck.id == deck.id){
          item_local.cards.push(card);
          control = true;
        }
      })

      if(!control){
        list_local.push({
          'deck': deck,
          'cards': new Array(card)
        });
      }

    });

    this.list = list_local;

  }

  logOut(){
    this.userService.logout(this.router);
  }

  addFile(event) {
    console.log('enetro');
    let file = event.target.files[0];
    this.excel = file;
    this.uploadExcel();
  }
  

}
