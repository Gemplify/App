import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {switchMap} from 'rxjs/internal/operators';
import {of} from 'rxjs/index';
import {SessionService} from '../../services/session.service';
import {Session} from '../../models/session';
import {SessionRel} from '../../models/sessionrel';
import {Card} from '../../models/card';
import {ConfigCard} from '../../models/configcard';
import {faSave, faImage, faFile, faEdit} from '@fortawesome/free-regular-svg-icons';
import {MatSnackBar} from '@angular/material';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
import {GLOBAL} from '../../global';
import {Utils} from '../../libs/utils';
import {Relation} from '../../models/relation';
import {RelationCard} from '../../models/relation_card';
import {
  faBars,
  faDownload, faInfoCircle, faLink, faPlus, faReply, faSpinner,
  faTimesCircle, faUser
} from '@fortawesome/free-solid-svg-icons';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';
import {Constant} from '../../models/constant';
import {BlockService} from '../../services/block.service';
import {Block} from '../../models/block';
import {Version} from '../../models/version';
import {Deck} from '../../models/deck';
import {CardService} from '../../services/card.service';
import {BlockRelDeck} from '../../models/blockreldeck';
import {RelationService} from '../../services/relation.service';
import {DeckService} from '../../services/deck.service';

declare var $: any;

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
  providers: [SessionService, UserService, BlockService, CardService, RelationService, DeckService]
})

export class SessionComponent implements OnInit {
  
  user: User;
  id: number;
  session: Session;
  answers: SessionRel[] = [];
  relations: any[] = [];
  list: any[] = [];
  backTop: number;
  frontTop:number;
  frontBot: number;
  time: any;
  editor = ClassicEditor;
  r: Relation = Relation.make();
  answerSelected: SessionRel = SessionRel.make();
  answerUploadSelected: SessionRel = SessionRel.make();
  global: any = GLOBAL;
  showImage: string = null;
  relationSelected: Relation = null;
  blockSelected: any = null;
  blockSearch: any[] = [];
  loadingBlock: boolean = false;
  constant: Constant = new Constant();
  controlSearch: boolean = false;
  sessionNew: Session = Session.make();
  errorSession: string = '';
  date: any;
  isLoad: boolean = true;
  card: Card = Card.make();
  c: Card = Card.make();
  errorCard: string = ''
  
  errorLoadSession: string = '';
  sessionLoadSearch: any[] = [];
  sessionLoadSelected: any = null;
  versionSelected: Version = null;
  
  relationCards: RelationCard[] = [];
  relationChoose: Relation = null;
  relationsByCard: Relation[] = [];
  controlDeleteRelation: boolean = false;
  relationSel: any = null;
  errorRelation: string = "";
  removeCardAux: SessionRel;
  
  deckSearch: Deck[] = [];
  errorSection: string = "";
  decksSelected: Deck[] = [];
  loadingSection: boolean = false;
  decks: Deck[] = [];
  
  
  faSave = faSave;
  faImage = faImage;
  faLink = faLink;
  faTimesCircle = faTimesCircle;
  faReply = faReply;
  faInfoCircle = faInfoCircle;
  faPlus = faPlus;
  faFile = faFile;
  faDownload = faDownload;
  faSpinner = faSpinner;
  faEdit = faEdit;
  faBars = faBars;
  faUser = faUser;
  
  
  constructor(private route: ActivatedRoute, private router: Router, private deckService: DeckService, private relationService: RelationService, private sessionService: SessionService, private snackBar: MatSnackBar,private userService: UserService, private blockService: BlockService, private cardService: CardService) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  ngOnInit() {
    this.refreshDate();
    this.user = this.userService.isLogin();
    this.route.paramMap.pipe(
      switchMap(params =>
        of(params)
      )
    ).subscribe((data) => {
      let share = data.get('share');
      let id = data.get('id');
      if(this.user != null){
        this.getSessionId(parseInt(id));
        this.getDecks();
      }else{
        if(share != null){
          this.checkShare(share, id);
        }else{
          this.router.navigate(['/']);
        }
      }
    });
  }
  
  refreshDate(){
    setInterval(() => { this.date = new Date() }, 1000)
  }
  
  onResize(event) {
    this.cardResize();
  }
  
  checkShare(share, id){
    this.sessionService.getSessionByIdAndShare(id, share).subscribe(
      result => {
        if (result.code === 200) {
          this.setSessionData(result);
        } else {
          this.router.navigate(['/']);
        }
      },
      error => {
        console.log(<any> error);
      }
    );
  }
  
  getSessionId(id: number){
    this.sessionService.getSessionById(id).subscribe(
      result => {
        if (result.code === 200) {
          this.setSessionData(result);
        } else {
          console.log(result.message);
        }
      },
      error => {
        console.log(<any> error);
      }
    );
  }
  
  onSearch(text: string, type: number){
    
    if(type == Constant.BLOCK && !this.controlSearch){
      this.blockSearch = [];
      this.controlSearch = true;
      this.blockService.getBlocksByText(text).subscribe(
        result => {
          if (result.code === 200) {
            let block;
            let decks = [];
            let version;
            let versions = [];
            for(let b of result.blocks){
              block = Block.make(b.block);
              versions = [];
              for(let v of b.versions){
                version = Version.make(v.version);
                decks = [];
                for(let d of v.decks){
                  decks.push(Deck.make(d));
                }
                versions.push({
                  'decks': decks,
                  'version': version
                })
              }
              let obj = block;
              obj['versions'] = versions;
              this.blockSearch.push(obj);
            }
            this.controlSearch = false;
          } else {
            console.log(result.message);
            this.controlSearch = false;
          }
        },
        error => {
          console.log(<any> error);
          this.controlSearch = false;
        }
      );
    }else if(type == Constant.SESSION && !this.controlSearch){
      this.sessionLoadSearch = [];
      this.controlSearch = true;
      this.sessionService.getSessionsByText(text, this.versionSelected).subscribe(
        result => {
          if (result.code === 200) {
            for(let s of result.sessions){
              this.sessionLoadSearch.push(Session.make(s));
            }
            this.controlSearch = false;
          } else {
            console.log(result.message);
            this.controlSearch = false;
          }
        },
        error => {
          console.log(<any> error);
          this.controlSearch = false;
        }
      );
    }else if(type === Constant.DECK){
      this.deckSearch = [];
      this.decks.forEach(deck => {
        if(deck != null && deck.text.toUpperCase().indexOf(text.toUpperCase()) > -1){
          let control = true;
          for(let item of this.list){
            if(item.deck != null && item.deck.slug == deck.slug){
              control = false;
            }
          }
          if(control){
            this.deckSearch.push(deck);
          }
        }
      })
    }
    
  }
  
  onData(data: any[], type: number){
    switch (type) {
      case Constant.BLOCK:
        this.sessionLoadSelected = null;
        this.blockSelected = data;
        console.log(this.blockSelected);
        break;
      case Constant.SESSION:
        this.sessionLoadSelected = data;
        break;
      case Constant.DECK:
        this.decksSelected = data;
        break;
    }
  }
  
  setSessionData(data: any){
  
    let count = 1000;
    let isNull = true
    let maxCount = 1000;
    let existUserCard = false;
    
    for(let relation of data.relations){
      let rel = Relation.make(relation.data);
      let cards = []
      for(let relcard of relation.cards){
        let rc = RelationCard.make(relcard);
        rc.card = Card.make(rc.card);
        cards.push(rc);
      }
      this.relations.push({
        'data': rel,
        'cards': cards
      });
    }
    
    this.session = Session.make(data.session);
    for(let ans of data.answers){
      let answer = SessionRel.make(ans);
      answer.session = this.session;
      answer.card = (ans.card != null) ? Card.make(answer.card) : null;
      isNull = (ans.configCard == null);
      answer.configCard = ((ans.configCard != null) ? ConfigCard.make(JSON.parse(ans.configCard)) : ConfigCard.make());
      if(answer.card != null && answer.card.type == Card.OPTIONS_MULTIPLE || answer.card != null && answer.card.type == Card.OPTIONS_SINGLE){
        answer.answer = (answer.answer != "" && answer.answer != null) ? JSON.parse(answer.answer) : Array((JSON.parse(answer.card.options)).length).fill(false);
      }
      if(answer.configCard.relationFocus != null){
        for(let rel of this.relations){
          if(rel.data.id == answer.configCard.relationFocus){
            this.relationSelected = rel.data;
          }
        }
      }
      this.answers.push(answer);
    }
    
    for(let ans of this.answers){
      let deck = (ans.card != null) ? ans.card.blockreldeck.deck : null;
      let exist = false;
      for(let item of this.list){
        if(item.deck != null && deck != null && item.deck.id == deck.id){
          exist = true;
          if(ans.card.type == Card.OPTIONS_SINGLE || ans.card.type == Card.OPTIONS_MULTIPLE){
            ans.card.options = JSON.parse(ans.card.options);
          }
          if(isNull){
            ans.configCard.zIndex = count;
          }else{
            maxCount = (maxCount < ans.configCard.zIndex) ? ans.configCard.zIndex : maxCount;
          }
          item.answers.push(ans);
        }else if(item.deck == null && deck == null){
          existUserCard = true;
          exist = true;
          ans.card = null;
          item.answers.push(ans);
        }
      }
      
      if(!exist){
        if(isNull){
          ans.configCard.zIndex = count;
        }
        if(ans.card != null && ans.card.type == Card.OPTIONS_SINGLE || ans.card != null &&  ans.card.type == Card.OPTIONS_MULTIPLE){
          ans.card.options = JSON.parse(ans.card.options);
        }
        this.list.push({
          'deck': deck,
          'answers': [ans]
        })
      }
      count++;
    }
  
    let countFinal;
  
    countFinal = (isNull) ? count : maxCount;
    
    this.backTop = countFinal;
    this.frontTop = countFinal+1;
    this.frontBot = countFinal+1;
    
    if(!isNull){
      this.cardResize();
    }
    
    this.card.blockreldeck.version = this.session.version;
    this.card.blockreldeck.block = this.session.version.block;
    
    console.log(this.list);
    
    setTimeout(() =>{
      this.isLoad = false;
    }, 500)
    
  }
  
  flip(ans: SessionRel){
    if(ans.configCard.flip == ConfigCard.FRONT){
      ans.configCard.flip = ConfigCard.BACK;
    }else{
      ans.configCard.flip = ConfigCard.FRONT;
    }
    ans.configCard.status = Card.ENABLED;
    this.reOrder(ans);
  }
  
  reOrder(ans: SessionRel){
    this.list.forEach(item =>{
      item.answers.forEach(answer =>{
        if (!answer.configCard.flip){
          if (answer.id == ans.id){
            //answer.card.zIndex = this.backTop;
            answer.configCard.zIndex = this.backTop;
          }else{
            //answer.card.zIndex -= 1;
            answer.configCard.zIndex -= 1;
          }
        }
      });
    });
    if (ans.configCard.flip) {
      this.frontTop += 1;
      ans.configCard.zIndex = this.frontTop;
    }
  }
  
  removeCard(){
    let ans = this.removeCardAux;
    ans.configCard.status = Card.DISABLED;
    $('#ModalConfirm').modal('hide');
  }
  
  blockCard(ans: SessionRel){
    ans.configCard.status = (ans.configCard.status === Card.BLOCKED) ? Card.ENABLED : Card.BLOCKED;
  }
  
  restart(){
    for(let item of this.list){
      for(let answer of item.answers){
        if(answer.card != null && answer.card.type == Card.OPTIONS_SINGLE || answer.card != null && answer.card.type == Card.OPTIONS_MULTIPLE){
          answer.answer = Array(answer.card.options.length).fill(false);
        }else if(answer.type != Card.CARD_USER){
          answer.answer = null;
        }
        answer.configCard = ConfigCard.make();
      }
    }
  }
  
  updateConfig(ev, answer: SessionRel){
    if(answer.configCard == null){
      answer.configCard = new ConfigCard(ConfigCard.BACK, 1000, ConfigCard.ENABLED, false, null, null, ev.source.getFreeDragPosition().x, ev.source.getFreeDragPosition().y, window.innerWidth, window.innerHeight);
    }else{
      answer.configCard.x = ev.source.getFreeDragPosition().x;
      answer.configCard.y = ev.source.getFreeDragPosition().y;
      answer.configCard.screenWidth = window.innerWidth;
      answer.configCard.screenHeight = window.innerHeight;
    }
  }
  
  cardResize(){
    let w = window.innerWidth;
    let h = window.innerHeight;
    for(let item of this.list){
      for(let answer of item.answers){
        if(answer.configCard != null){
          answer.configCard.x = ((answer.configCard.x * w) / answer.configCard.screenWidth) || 0;
          answer.configCard.y = ((answer.configCard.y * h) / answer.configCard.screenHeight) || 0;
          answer.configCard.screenWidth = w;
          answer.configCard.screenHeight = h;
        }
      }
    }
  }
  
  saveSessionUser(){
    this.sessionService.saveSessionUser(this.list).subscribe(
      result => {
        if (result.code === 200) {
          this.snackBar.open(result.message, "Ok", {duration: 5000})
        } else {
          this.snackBar.open(result.message, "Ok", {duration: 5000})
        }
      },
      error => {
        this.snackBar.open(error.message, "Ok", {duration: 5000})
      }
    );
  }
  
  chooseImage(answer: SessionRel){
    this.answerUploadSelected = answer;
    $("#imageCustom").click()
  }
  
  changeCustomImage(event){
    const reader = new FileReader();
    if(event.target.files && event.target.files.length){
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.answerUploadSelected.configCard.image = reader.result as string;
      }
    }
  }
  
  isBase64(options: string){
    return Utils.isBase64(options);
  }
  
  checkSingle(answer: any, i: number){
    if(answer.card.type == Card.OPTIONS_SINGLE){
      let j = 0;
      for(let ans of answer.answer){
        if(j != i){
          answer.answer[j] = false;
        }else{
          answer.answer[j] = true;
        }
        j++;
      }
    }
  }
  
  showRelations(relation: any){
    //limpiamos focus
    for(let item of this.list){
      for(let answer of item.answers){
        answer.configCard.relationFocus = null;
      }
    }
    if(this.relationSelected != null && relation.data.id != this.relationSelected.id || this.relationSelected == null){
      this.relationSelected = relation.data;
      for(let item of this.list){
        for(let answer of item.answers){
          for(let card of relation.cards){
            if(answer.card != null && answer.card.id == card.card.id){
              answer.configCard.relationFocus = relation.data.id;
            }
          }
        }
      }
    }else{
      this.relationSelected = null;
    }
  }
  
  showImg(img: string){
    var windowW = window.innerWidth * 0.7;
    var windowH = window.innerHeight * 0.7;
    var imagenBig = document.getElementById("imageBig");
    imagenBig.style.maxWidth = windowW + 'px';
    imagenBig.style.maxHeight = windowH + 'px';
    this.showImage = img;
  }
  
  info(){
    $('#modal-info').modal('show');
  }
  
  loadSession(){
    this.blockSearch = [];
    this.sessionLoadSelected = null;
    this.blockSelected = null;
    $('#ModalLoadSession').modal('show');
  }
  
  redirectSession(){
    $('#ModalLoadSession').modal('hide');
    this.router.navigate(['session/' + this.sessionLoadSelected.id]);
  }
  
  newSession(){
    this.blockSearch = [];
    this.blockSelected = null;
    this.versionSelected = null;
    $('#ModalNewSession').modal('show');
  }
  
  createNewSession(){
    this.errorSession = "";
    if(this.sessionNew.name != "" && this.sessionNew.description != "" && this.sessionNew.version.id != 0){
      console.log(this.sessionNew);
      this.sessionService.saveSession(this.sessionNew).subscribe(
        result => {
          if (result.code === 200) {
            $("#ModalNewSession").modal("hide");
            this.router.navigate(['session/' + result.session.data.id]);
          } else {
            this.errorSession = result.message;
            console.log(result.message);
          }
        },
        error => {
          this.errorSession = error.message;
          console.log(<any> error);
        }
      );
    }else{
      this.errorSession = "All fields are required";
    }
  }
  
  addCard(){
    if(this.user == null){
      this.card.pretype = Card.GLOBAL_USER;
      this.card.type = Card.USER_CARD;
    }
    $('#ModalAddCard').modal({ focus: false },'show');
  }
  
  chooseImageCard(){
    $("#imageCustomCard").click()
  }
  
  changeGlobalType(){
    if(this.card.pretype == Card.GLOBAL_TEXT_IMAGE){
      this.card.type = Card.TEXT;
    }else if(this.card.pretype == Card.GLOBAL_BLANK){
      this.card.type = Card.BLANK;
    }else if(this.card.pretype == Card.GLOBAL_OPTIONS){
      this.card.type = Card.OPTIONS_SINGLE;
    }else if(this.card.pretype == Card.GLOBAL_USER){
      this.card.type = Card.USER_CARD;
    }
    this.card.options = '';
    this.errorCard = '';
  }
  
  changeCustomImageCard(event){
    const reader = new FileReader();
    if(event.target.files && event.target.files.length){
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.card.options = reader.result as string;
      }
    }
  }
  
  saveCard(){
    console.log(this.card);
    this.errorCard = "";
    if(this.card.blockreldeck.deck.id != 0){
      if(this.card.text != ""){
        if(this.card.type == Card.TEXT && this.card.options == ''){
          this.errorCard = "Text is required";
        }
        if(this.card.type == Card.IMAGE && this.card.options == ''){
          this.errorCard = "Image is required";
        }
        if((this.card.type == Card.OPTIONS_SINGLE || this.card.type == Card.OPTIONS_MULTIPLE) && this.card.options == ''){
          this.errorCard = "Options is required";
        }
        if(this.errorCard == ''){
          this.actionSaveCard();
        }
      }else{
        this.errorCard = "Subject is required";
      }
    }else{
      
      if(this.card.type == Card.USER_CARD){
        if(this.card.options == ''){
          this.errorCard = "Text is required";
        }
        if(this.errorCard == ''){
          this.actionSaveCard();
        }
      }else{
        this.errorCard = "Section card is required";
      }
    }
    
  }
  
  actionSaveCard(){
    this.isLoad = true;
    this.cardService.addCardBySession(this.card, this.session).subscribe(
      result => {
        if (result.code === 200) {
          $("#ModalAddCard").modal("hide");
          this.isLoad = false;
          this.setNewCard(result);
          this.errorCard = '';
        } else {
          this.errorCard = result.message;
        }
      },
      error => {
        this.errorCard = error.message;
        console.log(<any> error);
      }
    );
  }
  
  setNewCard(result: any){
    let control = false;
    let answer = SessionRel.make(result.sessionrel);
    
    if(answer.type != Card.CARD_USER){
      for(let item of this.list){
        if(item.deck != null && item.deck.id == result.card.blockreldeck.deck.id && !control){
      
          answer.session = this.session;
          answer.card = Card.make(answer.card);
          answer.configCard = ConfigCard.make();
          if(answer.card.type == Card.OPTIONS_MULTIPLE || answer.card.type == Card.OPTIONS_SINGLE){
            answer.answer = Array((JSON.parse(answer.card.options)).length).fill(false);
            answer.card.options = JSON.parse(answer.card.options);
          }
      
          item.answers.push(answer);
          control = true;
        }
      }
    }else{
  
      answer.card = null;
      answer.session = this.session;
      answer.configCard = ConfigCard.make();
      
      for(let item of this.list){
        if(item.deck == null && !control){
          item.answers.push(answer);
          control = true;
        }
      }
      
      if(!control){
        this.list.push({
          'deck': null,
          'answers': [answer]
        })
        control = true;
      }
      
    }
    this.snackBar.open("Card successfully added", "Ok", {duration: 5000})
    console.log(this.list);
  }
  
  
  saveRelation(){
    this.errorRelation = "";
    if(this.relationChoose.name != "" && this.relationCards.length > 0){
      this.relationService.saveRelation(this.relationChoose, this.relationCards).subscribe(
        result => {
          if (result.code === 200) {
            this.getRelations()
            this.snackBar.open(result.message, "Ok", {duration: 5000})
          } else {
            this.errorRelation = result.message;
          }
        },
        error => {
          this.errorRelation = error.message;
          console.log(<any> error);
        }
      );
    }else{
      this.errorRelation = "Relation name and some cards is required";
    }
  }
  
  getRelations(){
    this.listRelation();
    this.relationService.getRelationsFromVersion(this.session.version).subscribe(
      result => {
        if (result.code === 200) {
          this.insertRelations(result);
        } else {
          this.snackBar.open(result.message, "Ok", {duration: 5000})
        }
      },
      error => {
        this.snackBar.open(error.message, "Ok", {duration: 5000})
        console.log(<any> error);
      }
    );
  }
  
  insertRelations(result: any){
    this.relations = [];
    for(let relation of result.relations){
      this.insertNewRelation(relation);
    }
  }
  
  insertNewRelation(relation: any){
    let r = Relation.make(relation.data);
    let rcs = [];
    for(let relationcard of relation.relationcards){
      let rc = RelationCard.make(relationcard);
      rcs.push(rc);
    }
    this.relations.push({
      'data': r,
      'cards': rcs
    })
  }
  
  deleteRelation(){
    this.relationService.removeRelation(this.relationChoose).subscribe(
      result => {
        if (result.code === 200) {
          this.getRelations()
          this.snackBar.open(result.message, "Ok", {duration: 5000})
        } else {
          this.errorRelation = result.message;
        }
      },
      error => {
        this.errorRelation = error.message;
        console.log(<any> error);
      }
    );
  }
  
  newRelation(){
    this.relationChoose = Relation.make();
    this.relationChoose.status = Relation.DISABLED;
    this.relationChoose.type = Relation.ADMIN;
    this.relationChoose.version = this.session.version;
    this.relationCards = [];
  }
  
  listRelation(){
    this.relationSel = null;
    this.relationChoose = null;
    this.relationCards = [];
    this.controlDeleteRelation = false;
  }
  
  addRelationCard(ev: any){
    let relationcard = RelationCard.make();
    relationcard.card = ev.value;
    relationcard.status = RelationCard.DISABLED;
    this.relationCards.push(relationcard);
  }
  
  removeRelationCard(relationcard: RelationCard){
    for(let [i, rc] of this.relationCards.entries()){
      if(relationcard == rc){
        if(relationcard.status == RelationCard.DISABLED){
          this.relationCards.splice(i, 1);
        }else {
          rc.status = RelationCard.DELETED;
        }
      }
    }
    
  }
  
  chooseRelation(ev: any){
    let rel = ev.value;
    this.relationChoose = rel.data;
    this.relationCards = [];
    for(let relationcard of rel.cards){
      this.relationCards.push(relationcard);
    }
    console.log(this.list);
  }
  
  existRelationCard(card: Card){
    let exist = false;
    for(let relationcard of this.relationCards){
      if(card != null && relationcard.card.id == card.id && relationcard.status != RelationCard.DELETED){
        exist = true;
      }
    }
    return exist;
  }
  
  saveSections(){
    this.errorSection = "";
    if(this.decksSelected.length > 0){
      this.blockService.saveDecksFromBlock({data: this.session.version}, this.decksSelected).subscribe(
        result => {
          if (result.code === 200) {
            this.setInitNewDecks(result.version.decks);
            this.decksSelected = [];
            $("#ModalCreateSection").modal("hide");
          } else {
            this.errorSection = result.message;
          }
        },
        error => {
          this.errorSection = error.message;
          console.log(<any> error);
        }
      );
    }else{
      this.errorSection = "Sections are required";
    }
  }
  
  setInitDecks(decks: any[]){
    decks.forEach(deck =>{
      let d = Deck.make(deck);
      this.decks.push(d);
      /*this.versionSelected.decks.push({
        'data': d,
        'cards': []
      });*/
    });
    
  }
  
  setInitNewDecks(decks: any[]){
    decks.forEach(deck =>{
      let d = Deck.make(deck);
      this.list.push({
        'deck': deck,
        'answers': []
      });
    });
  }
  
  getDecks(){
    this.deckService.getDecks().subscribe(
      result => {
        if (result.code === 200) {
          this.setInitDecks(result.decks);
        } else {
          console.log(result.message);
        }
      },
      error => {
        console.log(<any> error);
      }
    );
  }
  
}
