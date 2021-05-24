import { Component, OnInit } from '@angular/core';
import {Block} from '../../../models/block';
import {faClone, faCopy, faEdit, faFileExcel, faImage, faTrashAlt} from '@fortawesome/free-regular-svg-icons';
import {
  faBars, faChevronDown, faChevronUp, faCircleNotch, faLink, faPen,
  faPlus
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
import {Utils} from '../../../libs/utils';
import {User} from '../../../models/user';
import {UserService} from '../../../services/user.service';
import {Router} from '@angular/router';
import {Relation} from '../../../models/relation';
import {RelationCard} from '../../../models/relation_card';
import {RelationService} from '../../../services/relation.service';

declare var $: any;

@Component({
  selector: 'app-block-manager',
  templateUrl: './block-manager.component.html',
  styleUrls: ['./block-manager.component.scss'],
  providers: [BlockService, VersionService, CardService, UserService, RelationService]
})
export class BlockManagerComponent implements OnInit {
  
  faTrashAlt = faTrashAlt;
  faFileExcel = faFileExcel;
  faBars = faBars;
  faChevronDown = faChevronDown;
  faChevronUp = faChevronUp;
  faPlus = faPlus;
  faClone = faClone;
  faPen = faPen;
  faEdit = faEdit;
  faCopy = faCopy;
  faImage = faImage;
  faLink = faLink;
  faCircleNotch = faCircleNotch;
  
  user: User;
  block: any = null;
  c: Card = Card.make();
  card: Card = Card.make();
  auxCard: Card = Card.make();
  constant: Constant = new Constant();
  deckSearch: Deck[] = [];
  decks: Deck[] = [];
  version: Version = Version.make();
  errorSection: string = "";
  errorVersion: string = "";
  errorBlock: string = "";
  errorCard: string = "";
  errorRelation: string = "";
  editor = ClassicEditor;
  global: any = GLOBAL;
  isEdit: boolean = false;
  isImageEdit: boolean = false;
  utils: Utils;
  loadingSection: boolean = false;
  loadExcel: boolean = false;
  relations: any[] = [];
  versionSelected: any;
  relationSelected: Relation = null;
  elementSelected: any = null;
  decksSelected: Deck[] = [];
  relationCards: RelationCard[] = [];
  relationsByCard: Relation[] = [];
  controlDeleteRelation: boolean = false;
  relationSel: any = null;
  r: Relation = Relation.make();
  savingCard: boolean = false;
  
  
  constructor(private blockService: BlockService, private userService: UserService, private versionService: VersionService, private cardService: CardService, private relationService: RelationService, private snackBar: MatSnackBar, private router: Router) { }

  ngOnInit() {
    this.user = this.userService.isLogin();
    if (this.user == null || (!this.user && this.user.type === User.ADMIN)) {
      this.router.navigate(['admin/login']);
    }else{
      this.jqueryEvents();
    }
  }
  
  jqueryEvents(){
    let app = this;
    $(document).ready(function(){
      $('#ModalAddCard').on('hidden.bs.modal', function(){ app.closeEditCard(app); });
    });
  }
  
  closeEditCard(app: BlockManagerComponent){
    app.card.text = app.auxCard.text;
    app.card.options = app.auxCard.options;
    app.card = Card.make();
    app.auxCard = Card.make();
    app.isEdit = false;
    app.isImageEdit = false;
  }
  
  saveSections(){
    this.errorSection = "";
    if(this.decksSelected.length > 0){
      this.blockService.saveDecksFromBlock(this.versionSelected, this.decksSelected).subscribe(
        result => {
          if (result.code === 200) {
            this.setInitDecks(result.version.decks);
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
  
  isBase64(options: string){
    return Utils.isBase64(options);
  }
  
  updateVersion(){
    this.errorVersion = "";
    if(this.versionSelected.data.name != ""){
      this.versionService.update(this.versionSelected).subscribe(
        result => {
          if (result.code === 200) {
            $("#ModalEditVersion").modal("hide");
            this.snackBar.open(result.message, "Ok", {duration: 5000})
            this.errorVersion = '';
          } else {
            this.errorVersion = result.message;
          }
        },
        error => {
          this.errorVersion = error.message;
          console.log(<any> error);
        }
      );
    }else{
      this.errorVersion = "Version name is required";
    }
    
  }
  
  addVersion(){
    this.errorVersion = "";
    if(this.version.name != ""){
      this.versionService.add(this.version, this.block.data).subscribe(
        result => {
          if (result.code === 200) {
            $("#ModalAddVersion").modal("hide");
            this.errorVersion = '';
            this.snackBar.open(result.message, "Ok", {duration: 5000})
            this.setNewVersion(result.version);
          } else {
            this.errorVersion = result.message;
          }
        },
        error => {
          this.errorVersion = error.message;
          console.log(<any> error);
        }
      );
    }else{
      this.errorVersion = "Version name is required";
    }
    
  }
  
  updateBlock(){
    this.errorBlock = "";
    if(this.block.data.text != ""){
      this.blockService.update(this.block.data).subscribe(
        result => {
          if (result.code === 200) {
            $("#ModalEditBlock").modal("hide");
            this.snackBar.open(result.message, "Ok", {duration: 5000})
          } else {
            this.errorBlock = result.message;
          }
        },
        error => {
          this.errorBlock = error.message;
          console.log(<any> error);
        }
      );
    }else{
      this.errorBlock = "Block name is required";
    }
    
  }
  
  saveCard(){
    this.errorCard = "";
    this.savingCard = true;
    if(this.card.text != ""){
      if(this.card.type == Card.TEXT && this.card.options == ''){
        this.errorCard = "Text is required";
        this.savingCard = false;
      }
      if(this.card.type == Card.IMAGE && this.card.options == ''){
        this.errorCard = "Image is required";
        this.savingCard = false;
      }
      if((this.card.type == Card.OPTIONS_SINGLE || this.card.type == Card.OPTIONS_MULTIPLE) && this.card.options == ''){
        this.errorCard = "Options is required";
        this.savingCard = false;
      }
      if(this.errorCard == ''){
        if(!this.isEdit){
          this.cardService.addCard(this.card).subscribe(
            result => {
              if (result.code === 200) {
                $("#ModalAddCard").modal("hide");
                this.snackBar.open(result.message, "Ok", {duration: 5000})
                this.setNewCard(result.card);
                this.errorCard = '';
              } else {
                this.errorCard = result.message;
              }
              this.savingCard = false;
            },
            error => {
              this.errorCard = error.message;
              this.savingCard = false;
              console.log(<any> error);
            }
          );
        }else{
          this.cardService.updateCard(this.card).subscribe(
            result => {
              if (result.code === 200) {
                this.snackBar.open(result.message, "Ok", {duration: 5000})
                this.setUpdateCard(result.card);
                this.errorCard = '';
              } else {
                this.errorCard = result.message;
              }
              this.savingCard = false;
            },
            error => {
              this.errorCard = error.message;
              this.savingCard = false;
              console.log(<any> error);
            }
          );
        }
      }
    }else{
      this.errorCard = "Subject is required";
      this.savingCard = false;
    }
    
  }
  
  editCard(card: Card){
    this.errorCard = "";
    this.isEdit = true;
    if(card.type == Card.OPTIONS_MULTIPLE || card.type == Card.OPTIONS_SINGLE){
      card.pretype = Card.GLOBAL_OPTIONS;
    }else if(card.type == Card.BLANK){
      card.pretype = Card.GLOBAL_BLANK
    }else if(card.type == Card.TEXT || card.type == Card.IMAGE){
      card.pretype = Card.GLOBAL_TEXT_IMAGE;
    }
    this.card = card;
    this.auxCard = Card.make(card);
    $('#ModalAddCard').modal({ focus: false },'show');
  }
  
  setNewCard(c){
   let card = Card.make(c);
   card.blockreldeck = BlockRelDeck.make(card.blockreldeck);
   for(let deck of this.versionSelected.decks){
     if(deck.data.id == card.blockreldeck.deck.id){
       if(card.type == Card.OPTIONS_MULTIPLE || card.type == Card.OPTIONS_SINGLE){
         card.options = JSON.parse(card.options);
       }
       deck.cards.push(card);
     }
   }
  }
  
  setUpdateCard(c){
    let card = Card.make(c);
    if(card.type == Card.OPTIONS_MULTIPLE || card.type == Card.OPTIONS_SINGLE){
      card.options = JSON.parse(card.options);
    }
    this.auxCard.text = card.text;
    this.auxCard.options = card.options;
    $("#ModalAddCard").modal("hide");
  }
  
  setNewVersion(v){
    let version = {
      data: Version.make(v),
      decks: []
    }
    version.data.block = this.block.data;
    this.block.versions.unshift(version);
    this.versionSelected = this.block.versions[0];
  }
  
  setInitDecks(decks: any[]){
    decks.forEach(deck =>{
      let d = Deck.make(deck);
      this.versionSelected.decks.push({
        'data': d,
        'cards': []
      });
    });
    
  }
  
  onBlockSelected(block: any){
    this.block = block;
    this.versionSelected = (this.block != null) ? this.block.versions[0] : null;
    this.getRelations();
  }
  
  onDecks(decks: Deck[]){
    this.decks = decks;
  }
  
  onSearch(text: string, type: number){
    
    if(type === Constant.DECK){
      this.deckSearch = [];
      this.decks.forEach(deck => {
        if(deck.text.toUpperCase().indexOf(text.toUpperCase()) > -1){
          let control = true;
          this.versionSelected.decks.forEach(d => {
            if(d.data.slug === deck.slug){
              control = false;
            }
          })
          if(control){
            this.deckSearch.push(deck);
          }
        }
      })
    }
    
  }
  
  onData(data: any[], type: number){
    switch (type) {
      case Constant.DECK:
        this.decksSelected = data;
        break;
    }
  }
  
  checkDeck(deck: any, event){
    deck.data.checked = event.checked;
    for(let card of deck.cards){
      card.checked = event.checked;
    }
  }
  
  checkCard(card: Card, deck: any, event){
    card.checked = event.checked;
    if(!card.checked){
      deck.data.checked = false;
    }
  }
  
  chooseImage(){
    this.isImageEdit = true;
    $("#imageCustom").click()
  }
  
  changeCustomImage(event){
    const reader = new FileReader();
    if(event.target.files && event.target.files.length){
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.card.options = reader.result as string;
      }
    }
  }
  
  changeGlobalType(){
    if(this.card.pretype == Card.GLOBAL_TEXT_IMAGE){
      this.card.type = Card.TEXT;
    }else if(this.card.pretype == Card.GLOBAL_BLANK){
      this.card.type = Card.BLANK;
    }else if(this.card.pretype == Card.GLOBAL_OPTIONS){
      this.card.type = Card.OPTIONS_SINGLE;
    }
    this.card.options = '';
    this.errorCard = '';
  }
  
  chooseBlockRelDeck(deck: any){
    let brd = BlockRelDeck.make();
    brd.block = this.block.data;
    brd.deck = deck.data;
    brd.version = this.versionSelected.data;
    this.card.blockreldeck = brd;
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
            this.getRelations();
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
  
  showElements(){
      for(let [index, deck] of this.versionSelected.decks.entries()){
        console.log(deck.data);
      }
  }
  
  hideElements2(){
    for(let [index, deck] of this.versionSelected.decks.entries()){
      console.log(deck.data);
      if(deck.data.checked){
        this.versionSelected.decks.splice(index--, 1);
      }else{
        for(let [jdex, card] of deck.cards.entries()){
          if(card.checked){
            deck.cards.splice(jdex--, 1);
          }
        }
      }
    }
  }
  
  hideElements(){
    for(let i=0; i < this.versionSelected.decks.length; i++){
      if(this.versionSelected.decks[i].data.checked){
        this.versionSelected.decks.splice(i--, 1);
      }else{
        for(let j=0; j  < this.versionSelected.decks[i].cards.length; j++){
          if(this.versionSelected.decks[i].cards[j].checked){
            this.versionSelected.decks[i].cards.splice(j--, 1);
          }
        }
      }
    }
  }
  
  showModalUpload(){
    $("#ModalConfirmUpload").modal('hide');
    $("#upload-excel").click();
  }
  
  addFile(event){
    console.log('enetro');
    let file = event.target.files[0];
    this.uploadExcel(file);
  }
  
  uploadExcel(excel){
    if(excel != null){
      
      this.cardService.uploadCardsWithExcel(this.user, this.versionSelected, excel).then((result) => {
        if (result.code === 200) {
          this.setUploadCards(result.list);
        } else {
          console.log(result.msg);
        }
        //this.load = false;
      }, (error) => {
        //this.load = false;
        console.log(error);
      });
      
      
    }else{
      //this.load = false;
      console.log('Debes especificar un curso y subir el excel tipo.');
    }
  }
  
  setUploadCards(list: any){
    let d = [];
    for(let item of list){
      let c = [];
      for(let card of item.cards){
        let cd = Card.make(card);
        if(cd.type == Card.OPTIONS_MULTIPLE || cd.type == Card.OPTIONS_SINGLE){
          cd.options = JSON.parse(cd.options);
        }
        c.push(cd);
      }
      d.push({
        'data': Deck.make(item.deck),
        'cards': c
      });
    }
    this.versionSelected.decks = d;
    console.log(this.versionSelected);
  }
  
  getRelations(){
    this.listRelation();
    this.relationService.getRelationsFromVersion(this.versionSelected.data).subscribe(
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
      if(relation.data.type == Relation.ADMIN){
        this.insertNewRelation(relation);
      }
    }
  }
  
  saveRelation(){
    this.errorRelation = "";
    if(this.relationSelected.name != "" && this.relationCards.length > 0){
      this.relationService.saveRelation(this.relationSelected, this.relationCards).subscribe(
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
  
  insertUpdateRelation(result: any){
  
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
  
  deleteRelation(){
    this.relationService.removeRelation(this.relationSelected).subscribe(
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
    this.relationSelected = Relation.make();
    this.relationSelected.status = Relation.DISABLED;
    this.relationSelected.type = Relation.ADMIN;
    this.relationSelected.version = this.versionSelected.data;
    this.relationCards = [];
  }
  
  listRelation(){
    this.relationSel = null;
    this.relationSelected = null;
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
  
  existRelationCard(card: Card){
    let exist = false;
    for(let relationcard of this.relationCards){
      if(relationcard.card.id == card.id && relationcard.status != RelationCard.DELETED){
        exist = true;
      }
    }
    return exist;
  }
  
  chooseRelation(ev: any){
    let rel = ev.value;
    this.relationSelected = rel.data;
    this.relationCards = [];
    for(let relationcard of rel.relationcards){
      this.relationCards.push(relationcard);
    }
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
  
  showRelationClick(relation: any){
    this.relationSel = null;
    this.relationSelected = relation.data;
    this.relationCards = [];
    for(let relationcard of relation.relationcards){
      this.relationCards.push(relationcard);
    }
    $("#ModalShowRelations").modal("hide");
    $("#ModalRelations").modal("show");
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
  
  exportExcel(){
    this.loadExcel = true;
    this.cardService.exportExcel(this.user, this.versionSelected).subscribe(
      result => {
        if (result.code === 200) {
          let snackBarRef = this.snackBar.open("Excel successfully generated", 'Download' , {duration: null})
          snackBarRef.onAction().subscribe(()=> {
            window.open(GLOBAL.api + 'assets/excels/'+result.excel, '_blank');
          });
        } else {
          this.snackBar.open(result.message, "Ok", {duration: 5000})
        }
        this.loadExcel = false;
      },
      error => {
        this.loadExcel = false;
        console.log(<any> error);
      }
    );
    
    
  }
  
  
}
