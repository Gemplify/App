import { Component, OnInit } from '@angular/core';
import {faClock, faClone} from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-nav-left',
  templateUrl: './nav-left.component.html',
  styleUrls: ['./nav-left.component.scss']
})
export class NavLeftComponent implements OnInit {
  
  faClock = faClock;
  faClone = faClone;
  
  constructor() { }

  ngOnInit() {
  }

}
