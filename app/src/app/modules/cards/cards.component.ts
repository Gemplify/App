import { Component, OnInit } from '@angular/core';
import {Card} from '../../models/card';
import {CardService} from "../../services/card.service";
import {Deck} from "../../models/deck";


declare let $ :any;

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
  providers: [CardService]
})
export class CardsComponent implements OnInit {

  list: any[] = [];
  status: boolean = false;

  backTop: number;
  frontTop:number;
  frontBot: number;
  time: any;

  constructor(private cardService: CardService) { }

  ngOnInit() {
    this.getCards();
    setInterval(interval =>{
      this.getTime();
    }, 1000);
  }

  getTime(){
    let date = new Date();
    this.time = (date.getDate()<10?'0':'')+date.getDate() + '/' + ((date.getMonth() + 1)<10?'0':'')+(date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + (date.getHours()<10?'0':'')+date.getHours() + ':' + (date.getUTCMinutes()<10?'0':'')+date.getUTCMinutes() + ':' + (date.getUTCSeconds()<10?'0':'')+date.getUTCSeconds();
  }

  getCards(){ /* LLAMA AL SERVICIO PARA CONSEGUIR LAS CARTAS ALMACENADAS EN BBDD */

    this.cardService.getCard().subscribe(

      result => {
        //console.log(result);
        if (result.code === 200) {
          this.setCards(result.list); /* CREA EL ARRAY CON LOS OBJETOS CARTAS */
        } else {
          console.log(result.message);
        }
      },
      error => {
        console.log(<any> error);
      }

    );

  }

  setCards(list: any[]){

    let count = 1000;

    list.forEach(item =>{
      let deck = Deck.make(item.deck);
      let cards = [];
      item.cards.forEach(card =>{
        let c = Card.make(card);
        c.zIndex = count;
        if(card.options !== ""){
          let options = [];
          let split = card.options.split('<>');
          split.forEach(opt =>{
            options.push(opt.trim());
          });
          c.options = options;
        }
        cards.push(c);
        count++;
      })
      this.list.push({
        'deck': deck,
        'cards': cards
      });
      
    });

    console.log(this.list);

    this.backTop = count;
    this.frontTop = count+1;
    this.frontBot = count+1;

  }

  flip(card: Card){
    card.flip = !card.flip;
    card.status = Card.ENABLED;
    this.reOrder(card);
  }

  reOrder(card: Card){

    this.list.forEach(item =>{

      item.cards.forEach(cardIn =>{

        if (!cardIn.flip){
          if (cardIn.id == card.id){
            cardIn.zIndex = this.backTop;
          }else{
            cardIn.zIndex -= 1;
          }

        }

      });

    });


    if (card.flip) {
      this.frontTop += 1;
      card.zIndex = this.frontTop;
    }

  }

  removeCard(card:Card){
    card.status = Card.DISABLED;
  }

  blockCard(card:Card){
    card.status = (card.status === Card.BLOCKED) ? Card.ENABLED : Card.BLOCKED;
  }

  restart(){
    window.location.reload();
  }

  info(){
    $('#modal-info').modal('show');
  }

}
