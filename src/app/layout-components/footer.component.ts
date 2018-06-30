import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'si-footer',
    templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {
    public year: number =  new Date().getFullYear();
    constructor() { }

    ngOnInit() { }
}