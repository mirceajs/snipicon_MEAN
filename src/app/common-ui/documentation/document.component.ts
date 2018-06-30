import {Component,OnInit,Output} from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
    selector: 'icon-document',
    templateUrl: './document.component.html',
    styleUrls: ['./document.component.scss']
})

export class DocumentationComponent implements OnInit {
 
   @Output() public close: EventEmitter<any> = new EventEmitter();
   constructor() {
        this.close.emit(null);
    }

   ngOnInit() {
       this.close.emit(null);
   
   }
}
