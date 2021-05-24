import {Component, NgZone, OnInit} from '@angular/core';
import {Block} from '../../../models/block';
import {
  faClipboard,
  faClock, faClone, faCopy, faEdit, faEye, faFileExcel, faImage,
  faTrashAlt
} from '@fortawesome/free-regular-svg-icons';
import {
  faBars, faChevronDown, faChevronUp, faCircleNotch, faLink, faPen, faPlus, faShareAlt,
  faSignInAlt, faUser, faWindowMaximize
} from '@fortawesome/free-solid-svg-icons';
import {Constant} from '../../../models/constant';
import {Deck} from '../../../models/deck';
import {BlockService} from '../../../services/block.service';
import {Version} from '../../../models/version';
import {VersionService} from '../../../services/version.service';
import {MatSnackBar} from '@angular/material';
import {Card} from '../../../models/card';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {CardService} from '../../../services/card.service';
import {BlockRelDeck} from '../../../models/blockreldeck';
import {GLOBAL} from '../../../global';
import {DomSanitizer} from '@angular/platform-browser';
import {Utils} from '../../../libs/utils';
import {User} from '../../../models/user';
import {UserService} from '../../../services/user.service';
import {Router} from '@angular/router';
import {Session} from '../../../models/session';
import {SessionService} from '../../../services/session.service';
import {BlockManagerComponent} from '../block-manager/block-manager.component';
import {SessionRel} from '../../../models/sessionrel';
import {RelationService} from '../../../services/relation.service';
import {Relation} from '../../../models/relation';
import {RelationCard} from '../../../models/relation_card';

declare var $: any;

@Component({
  selector: 'app-session-manager',
  templateUrl: './session-manager.component.html',
  styleUrls: ['./session-manager.component.scss'],
  providers: [SessionService, VersionService, CardService, UserService, RelationService]
})
export class SessionManagerComponent implements OnInit {
  
  faTrashAlt = faTrashAlt;
  faPlus = faPlus;
  faPen = faPen;
  faCopy = faCopy;
  faClock = faClock;
  faEye = faEye;
  faCircleNotch = faCircleNotch;
  faWindowMaximize = faWindowMaximize;
  faLink = faLink;
  faUser = faUser;
  faShareAlt = faShareAlt;
  faClipboard = faClipboard;
  
  user: User;
  block: any = null;
  c: Card = Card.make();
  r: Relation = Relation.make();
  card: Card = Card.make();
  constant: Constant = new Constant();
  decksSelected: Deck[] = [];
  deckSearch: Deck[] = [];
  decks: Deck[] = [];
  version: Version = Version.make();
  versionSelected: any = null;
  editor = ClassicEditor;
  elementSelected: any = null;
  global: any = GLOBAL;
  isImageEdit: boolean = false;
  utils: Utils = Utils;
  sessions: Session[] = [];
  errorSession: string = '';
  errorShare: string = '';
  session: Session = Session.make();
  auxSession: Session = Session.make();
  sessionSelected: Session = Session.make();
  sessionSelectedShow: Session = Session.make();
  loadSession: boolean = false;
  showSession: boolean = false;
  answerData: SessionRel = null;
  relations: any[] = [];
  relationsByCard: Relation[] = [];
  
  constructor(private ngZone: NgZone, private relationService: RelationService, private sessionService: SessionService, private userService: UserService, private versionService: VersionService, private cardService: CardService, private snackBar: MatSnackBar, public sanitization: DomSanitizer, private router: Router) { }

  ngOnInit() {
    this.user = this.userService.isLogin();
    if (this.user == null || (!this.user && this.user.type === User.ADMIN)) {
      this.router.navigate(['admin/login']);
    }
    this.jqueryEvents();
  }
  
  jqueryEvents(){
    let app = this;
    $(document).ready(function(){
      $('#ModalEditSession').on('hidden.bs.modal', function(){ app.closeEditSession(app); });
    });
  }
  
  closeEditSession(app: SessionManagerComponent){
    // forzamos refresh de doom por estar en un proceso fuera de la jerarquía de angular
    app.ngZone.run(() => {
      app.sessionSelected.name = app.auxSession.name;
      app.sessionSelected.description = app.auxSession.description;
      app.sessionSelected = Session.make();
      app.auxSession = Session.make();
    });
  }
  
  saveSession(){
    this.errorSession = "";
    if(this.session.name != "" && this.session.description != ""){
      this.sessionService.saveSession(this.session).subscribe(
        result => {
          if (result.code === 200) {
            $("#ModalCreateSession").modal("hide");
            this.setNewSession(result.session);
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
  
  editSession(session: Session){
    this.sessionSelected = session;
    this.auxSession = Session.make(session);
  }
  
  updateSession(){
    this.errorSession = "";
    if(this.sessionSelected.name != "" && this.sessionSelected.description != ""){
      this.sessionService.updateSession(this.sessionSelected).subscribe(
        result => {
          if (result.code === 200) {
            this.auxSession.name = result.session.name;
            this.auxSession.description = result.session.description;
            $("#ModalEditSession").modal("hide");
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
  
  getSessions(){
    if(this.versionSelected != null){
      this.loadSession = true;
      this.session.version = this.versionSelected.data;
      this.sessionService.getSessionsForVersion(this.versionSelected).subscribe(
        result => {
          if (result.code === 200) {
            this.setInitSessions(result.sessions);
          } else {
            console.log(result.message);
            this.loadSession = false;
          }
        },
        error => {
          this.loadSession = false;
          console.log(<any> error);
        }
      );
    }
  }
  
  setNewSession(session: any){
    let s = Session.make(session.data);
    let v = Version.make(s.version);
    let b = Block.make(v.block);
    s.version = v;
    s.version.block = b;
    let ans = []
    for(let answer of session.answers){
      ans.push(SessionRel.make(answer));
    }
    s.answers = ans;
    this.sessions.unshift(s);
  }
  
  setInitSessions(sessions: any){
    this.sessions = [];
    for(let session of sessions){
      let s = Session.make(session.data);
      let v = Version.make(s.version);
      let b = Block.make(v.block);
      s.version = v;
      s.version.block = b;
      let ans = []
      for(let answer of session.answers){
        if(answer.card.type == Card.OPTIONS_MULTIPLE || answer.card.type == Card.OPTIONS_SINGLE){
          answer.answer = (answer.answer != "" && answer.answer != null) ? JSON.parse(answer.answer) : Array((JSON.parse(answer.card.options)).length).fill(false);
          answer.card.options = JSON.parse(answer.card.options);
        }
        ans.push(SessionRel.make(answer));
      }
      s.answers = ans;
      this.sessions.push(s);
    }
    this.loadSession = false;
  }
  
  checkSession(card: Card, deck: any, event){
    card.checked = event.checked;
    if(!card.checked){
      deck.data.checked = false;
    }
  }
  
  onBlockSelected(block: any){
    this.block = block;
    this.versionSelected = (this.block != null) ? this.block.versions[0] : null;
    this.showSession = false;
    this.getSessions();
  }
  
  onDecks(decks: Deck[]){
    this.decks = decks;
  }
  
  removeElements(){
    let control = false;
    let selectedDeck = [];
    let selectedCard = [];
    for(let deck of this.versionSelected.decks){
      if(deck.data.checked){
        selectedDeck.push(deck.data);
      }else{
        for(let card of deck.cards){
          if(card.checked){
            selectedCard.push(card);
          }
        }
      }
    }
    if(selectedDeck.length > 0 || selectedCard.length > 0){
      this.cardService.deleteDeckCards(selectedDeck, selectedCard, this.versionSelected).subscribe(
        result => {
          if (result.code === 200) {
            this.hideElements();
          }
          $("#ModalConfirm").modal("hide");
          this.snackBar.open(result.message, "Ok", {duration: 5000})
        },
        error => {
          $("#ModalConfirm").modal("hide");
          this.snackBar.open(error.message, "Ok", {duration: 5000})
        }
      );
    }else{
      $("#ModalConfirm").modal("hide");
      this.snackBar.open("There are no elements selected", "Ok", {duration: 5000})
    }
  }
  
  hideElements(){
    for(let [index, deck] of this.versionSelected.decks.entries()){
      if(deck.data.checked){
        this.versionSelected.decks.splice(index, 1);
      }else{
        for(let [jdex, card] of deck.cards.entries()){
          if(card.checked){
            deck.cards.splice(jdex, 1);
          }
        }
      }
    }
  }
  
  showSessionAction(session: Session){
    this.sessionSelectedShow = session;
    this.showSession = true;
    this.getRelations();
  }
  
  getAttributeSessionRelByCard(card: Card, attr: string){
    for(let session of this.sessionSelectedShow.answers){
      if(card.id == session.card.id){
        return session[attr];
      }
    }
    return null;
  }
  
  getSessionRelByCard(card: Card){
    for(let session of this.sessionSelectedShow.answers){
      if(card.id == session.card.id){
        return session;
      }
    }
    return null;
  }
  
  setAnswerData(card: Card){
    this.answerData = this.getSessionRelByCard(card);
    let config: any = this.answerData.configCard;
    this.answerData.configCard = JSON.parse(config);
  }
  
  isPending(card){
    let rel = this.getSessionRelByCard(card);
    return (rel.status == SessionRel.PENDING);
  }
  
  getRelations(){
    this.relationService.getRelationsFromVersion(this.sessionSelectedShow.version).subscribe(
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
    console.log(this.relations);
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
      'relationcards': rcs
    })
  }
  
  haveRelation(card: Card){
    for(let relation of this.relations){
      for(let relationcard of relation.relationcards){
        if(relationcard.card.id == card.id && relationcard.status != RelationCard.DELETED){
          return true;
        }
      }
    }
    return false;
  }
  
  showRelations(card: Card){
    this.relationsByCard = [];
    for(let relation of this.relations){
      let exist = false;
      for(let rel of this.relationsByCard){
        if(rel.id == relation.data.id){
          exist = true;
        }
      }
      if(!exist){
        for(let relationcard of relation.relationcards){
          if(relationcard.card.id == card.id && relationcard.status != RelationCard.DELETED){
            this.relationsByCard.push(relation);
          }
        }
      }
    }
  }
  
  createShare(){
    this.errorShare = '';
    let isFirst = (this.sessionSelected.share === '');
    if(this.sessionSelected.expiration != ''){
      this.sessionService.shareUrl(this.sessionSelected).subscribe(
        result => {
          if (result.code === 200) {
            let b = Block.make(result.session.version.block);
            let v = Version.make(result.session.version);
            this.sessionSelected = Session.make(result.session);
            this.sessionSelected.version = v;
            this.sessionSelected.version.block = b;
            if(!isFirst){
              $("#ModalShare").modal("hide");
            }
            this.snackBar.open(result.message, "Ok", {duration: 5000})
          } else {
            this.snackBar.open(result.message, "Ok", {duration: 5000})
          }
        },
        error => {
          this.snackBar.open(error.message, "Ok", {duration: 5000})
          console.log(<any> error);
        }
      );
    }else{
      this.errorShare = 'Expiration date is required.';
    }
  }
  
  copyUrl(){
    navigator.clipboard.writeText(this.global.domain + 'session/' + this.sessionSelected.id + '/' + this.sessionSelected.share)
    this.snackBar.open("Url copied on the clipboard", "Ok", {duration: 5000})
  }
  
}
