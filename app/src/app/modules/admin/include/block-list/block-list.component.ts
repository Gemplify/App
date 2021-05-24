import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {faCircleNotch, faPlus, faSearch} from '@fortawesome/free-solid-svg-icons';
import {faClone, faTrashAlt} from '@fortawesome/free-regular-svg-icons';
import {Deck} from '../../../../models/deck';
import {DeckService} from '../../../../services/deck.service';
import {Constant} from '../../../../models/constant';
import {Block} from '../../../../models/block';
import {BlockService} from '../../../../services/block.service';
import {Version} from '../../../../models/version';
import {Card} from '../../../../models/card';
import {MatSnackBar} from '@angular/material';

declare var $:any;


@Component({
  selector: 'app-block-list',
  templateUrl: './block-list.component.html',
  styleUrls: ['./block-list.component.scss'],
  providers: [DeckService, BlockService]
})
export class BlockListComponent implements OnInit {
  
  faSearch = faSearch;
  faClone = faClone;
  faTrashAlt = faTrashAlt;
  faCircleNotch = faCircleNotch;
  
  loadingSection: boolean = false;
  decks: Deck[] = [];
  blocks: any[] = [];
  version: Version = Version.make();
  deckSearch: Deck[] = [];
  decksSelected: Deck[] = [];
  blockSelectedCss: Block = Block.make();
  constant: Constant = new Constant();
  textSearch: string = "";
  block: Block = Block.make();
  loadSearch: boolean = false;
  error: string = "";
  
  @Output() blockSelected = new EventEmitter<any>();
  @Output() deckEmit = new EventEmitter<Deck[]>();
  
  constructor(private deckService: DeckService, private blockService: BlockService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.version.block = this.block;
    this.version.name = "v1";
    this.eventjQuery();
    this.getDecks();
    this.getBlocks()
  }
  
  eventjQuery(){
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })
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
  
  getBlocks(){
    this.loadSearch = true;
    this.blockService.getBlocksRel().subscribe(
      result => {
        if (result.code === 200) {
          this.setInitBlocks(result.blocks);
        } else {
          console.log(result.message);
        }
      },
      error => {
        console.log(<any> error);
      }
    );
  }
  
  findBlocks(deck: Deck){
    this.loadSearch = true;
    this.blockService.getBlocksByDeck(deck).subscribe(
      result => {
        if (result.code === 200) {
          this.setInitBlocks(result.blocks);
        } else {
          console.log(result.message);
        }
      },
      error => {
        console.log(<any> error);
      }
    );
  }
  
  searchBlockByText(event){
    if(this.textSearch.length > 0){
      this.loadSearch = true;
      this.blockService.getBlocksByText(this.textSearch).subscribe(
        result => {
          if (result.code === 200) {
            this.setInitBlocks(result.blocks);
          } else {
            console.log(result.message);
          }
        },
        error => {
          console.log(<any> error);
        }
      );
    }else{
      this.getBlocks()
    }
  }
  
  clearSearch(){
    this.textSearch = "";
    this.blockSelected.emit(null);
    this.blockSelectedCss = Block.make();
    this.getBlocks();
  }
  
  saveBlock(){
    this.error = "";
    if(this.block.text != "" && this.version.name != ""){
      this.blockService.saveBlock(this.version, this.decksSelected).subscribe(
        result => {
          if (result.code === 200) {
            // add block
            let d = [];
            result.block.decks.forEach(deck =>{
              d.push({
                'data': Deck.make(deck),
                'cards': []
              });
            })
            let b = Block.make(result.block.data);
            let v = Version.make(result.block.version);
            v.block = b;
            this.blocks.push({
              'data': b,
              'versions': [{
                'data': v,
                'decks': d
              }]
            });
            console.log(this.blocks);
            // show result
            $("#ModalCreateBlock").modal("hide");
            this.snackBar.open(result.message, "Ok", {duration: 5000})
            // clean
            this.block = Block.make();
            this.decksSelected = [];
          } else {
            this.error = result.message;
          }
        },
        error => {
          this.error = error.message;
          console.log(<any> error);
        }
      );
    }else{
      this.error = "Block name and version name are required";
    }
  }
  
  setInitBlocks(blocks: any[]){
    this.blocks = [];
    blocks.forEach(list =>{
      let b = Block.make(list.block);
      let v = [];
      for(let version of list.versions){
        let d = [];
        version.decks.forEach(deck =>{
          let c = [];
          for(let card of deck.cards){
            let cd = Card.make(card);
            if(cd.type == Card.OPTIONS_MULTIPLE || cd.type == Card.OPTIONS_SINGLE){
              cd.options = JSON.parse(cd.options);
            }
            c.push(cd);
          }
          d.push({
            'data': Deck.make(deck.data),
            'cards': c
          });
        })
        let vs = Version.make(version.version);
        vs.block = b;
        v.push({
          'data': Version.make(vs),
          'decks': d
        })
      }
      this.blocks.push({
        'data': b,
        'versions': v
      });
    });
    this.loadSearch = false;
  }
  
  selectBlock(block: any){
    this.blockSelectedCss = block.data;
    this.blockSelected.emit(block);
  }
  
  checkBlock(block: Block, event){
    block.checked = event.checked;
  }
  
  deleteBlock(){
    let control = false;
    let selected = [];
    this.blocks.forEach(block =>{
      if(block.checked){
        selected.push(block.data);
      }
    });
    if(selected.length > 0){
      this.blockService.deleteBlocks(selected).subscribe(
        result => {
          if (result.code === 200) {
            this.getBlocks();
          }
          this.snackBar.open(result.message, "Ok", {duration: 5000})
        },
        error => {
          this.snackBar.open(error.message, "Ok", {duration: 5000})
        }
      );
    }else{
      this.snackBar.open("There is no block selected", "Ok", {duration: 5000})
    }
  }
  
  setInitDecks(decks: any[]){
    decks.forEach(deck =>{
      let d = Deck.make(deck);
      this.decks.push(d);
    });
    this.deckEmit.emit(this.decks);
  }
  
  
  
  onSearch(text: string, type: number){
    
    if(type === Constant.DECK){
      this.deckSearch = [];
      this.decks.forEach(deck => {
        if(deck.text.toUpperCase().indexOf(text.toUpperCase()) > -1){
          this.deckSearch.push(deck);
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
  

}
