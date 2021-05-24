import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {faArrowLeft, faArrowRight, faCircleNotch, faPlus} from '@fortawesome/free-solid-svg-icons';
import {Utils} from '../../../../libs/utils';

@Component({
  selector: 'app-select-list-box',
  templateUrl: './select-list-box.component.html',
  styleUrls: ['./select-list-box.component.scss']
})
export class SelectListBoxComponent implements OnInit {
  
  faCircleNotch = faCircleNotch;
  faPlus = faPlus;
  
  @Input() data: any[];
  @Input() load: boolean;
  @Input() name: string;
  @Input() disabled: boolean;
  @Output() dataOut = new EventEmitter<any[]>();
  @Output() dataSearch = new EventEmitter<any[]>();
  dataChoose: any = null;
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
    this.dataChoose = item;
    this.data = [];
    this.stringsearch = item[this.name[0]];
    this.dataOut.emit(this.dataChoose);
  }
  
  removeAll(){
    this.dataChoose = null;
    this.stringsearch = '';
    this.dataOut.emit(this.dataChoose);
  }
  
}
