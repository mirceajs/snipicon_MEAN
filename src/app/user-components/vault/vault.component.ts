import { Component, OnInit,Input,ChangeDetectorRef } from '@angular/core';
import {ToolBarInterface} from '../.././toolbar-component/toolbar.interface';

@Component({
    templateUrl: './vault.component.html',
    styleUrls: ['./vault.component.scss']
})
export class VaultComponent implements ToolBarInterface {
  @Input() data: any;
   
    constructor(private cdRef:ChangeDetectorRef) { }

    public ngOnInit() {
      
    }

   }