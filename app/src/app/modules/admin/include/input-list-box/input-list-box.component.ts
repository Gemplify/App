import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {faArrowLeft, faArrowRight, faCircleNotch, faPlus} from '@fortawesome/free-solid-svg-icons';
import {Utils} from '../../../../libs/utils';

@Component({
  selector: 'app-input-list-box',
  templateUrl: './input-list-box.component.html',
  styleUrls: ['./input-list-box.component.scss']
})
export class InputListBoxComponent implements OnInit {
  
  faCircleNotch = faCircleNotch;
  faPlus = faPlus;
  
  @Input() data: any[];
  @Input() load: boolean;
  @Input() name: string;
  @Output() dataOut = new EventEmitter<any[]>();
  @Output() dataSearch = new EventEmitter<any[]>();
  dataChoose: any[] = [];
  object: any;
  stringsearch: string;
  
  @Input()
  set clean(clean: boolean){
    if(clean){
      this.removeAll()
    }
  }
  
  constructor() { }
  
  ngOnInit() {
  }
  
  search(event: any){
    let string = event.target.value;
    this.dataSearch.emit(string);
  }
  
  choose(item){
    let control = false;
    this.dataChoose.forEach((d, i, o) =>{
      if(item.id === d.id){
        control = true;
      }
    });
    if(!control){
      this.dataChoose.push(item);
      this.data = [];
      this.stringsearch = '';
      this.dataOut.emit(this.dataChoose);
    }
  }
  
  remove(item){
    this.dataChoose.forEach((d, i, o) =>{
      if(item.id === d.id){
        o.splice(i, 1);
      }
    });
    this.dataOut.emit(this.dataChoose);
  }
  
  removeAll(){
    this.dataChoose = [];
    this.dataOut.emit(this.dataChoose);
  }
  
  add(){
    if(this.stringsearch != ""){
      let control = false;
      let slug = Utils.generateSlug(this.stringsearch);
      this.data.forEach(item =>{
        if(item.slug == slug){
          control = true;
        }
      })
      this.dataChoose.forEach(item =>{
        if(item.slug == slug){
          control = true;
        }
      })
      if(!control){
        let item = {};
        item[this.name[0]] = this.stringsearch;
        item['slug'] = slug;
        this.dataChoose.push(item);
        this.data = [];
        this.stringsearch = '';
        this.dataOut.emit(this.dataChoose);
      }
    }
  }

}
