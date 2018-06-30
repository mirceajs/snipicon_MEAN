import { Component, OnInit, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { AuthServiceSnip} from '.././services/auth.service';

@Component({
    selector: 'si-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SideBarComponent implements OnInit {
    @Input() 
        public closed: boolean = true;

    @Output()
        public close: EventEmitter<any> = new EventEmitter();

    constructor(private authSer : AuthServiceSnip) { }

    ngOnInit() { }

    public logout()
    {
     this.authSer.logout();
    }
    public closeMenu() {
        this.closed = true;
        this.close.emit(null);
    }
}