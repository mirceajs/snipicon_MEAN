import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
    selector: 'si-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
    public opened: Boolean = false;
    loggedin = false;
    loggedinInfo = {type:'',name:''};
    @Output()
        public open: EventEmitter<any> = new EventEmitter();
    @Output()
        public close: EventEmitter<any> = new EventEmitter();

    constructor() { }

    ngOnInit() {

     let info = JSON.parse(localStorage.getItem("SnipData"));// && JSON.parse(localStorage.getItem("SnipData")).userId  ? JSON.parse(localStorage.getItem("SnipData")).userId  : null; 
     this.loggedin = info && info.userId;
     this.loggedinInfo = { type : info && info.loginType ? info.loginType :'',
                           name : info && info.email ? info.loginType=='email'? info.email : info.name:'' 
                          }  ;
     }

    public toggleSidebar() {
        // if(this.opened) {
        //     this.close.emit(null);
        //     this.opened = false;
        // }else {
            this.open.emit(null);  
            this.opened = true; 
        //}
        
    }
}