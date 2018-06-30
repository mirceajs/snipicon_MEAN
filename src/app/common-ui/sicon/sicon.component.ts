import { Component, Output, EventEmitter, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { Icon } from './icon.interface';

@Component({
  selector: 'ui-sicon',
  template: `
    <figure [class.activeiconbox]="selected">
      <span class="count float-xs-right">{{icon}}</span>
      <img (click)="select.emit(icon)" *ngIf="thumbnail" [src]="thumbnail" [alt]="title"/>
    </figure>

  `,
  styles: [`
  .si-incollection {
    border: solid transparent;
    border-bottom-color: #d33;
  }
  `],
})
export class SIconComponent {
  @Input() icon: Icon;
  @Input() selected = false;
  @Output() select = new EventEmitter<any>();


  protected urlPrefix = 'http://snipicons.com/';

  constructor(private sanitizer: DomSanitizer) {

  }
  
  get title() {
    return this.icon.Name;
  }

  get subtitle() {
    return this.icon.Name;
  }

  get thumbnail(): string | boolean | SafeResourceUrl{
//    console.log("inCollection: "+ this.inCollection);
    if (this.icon.HashedFullFilePath) {
      return this.urlPrefix + this.icon.HashedFullFilePath;
    } else if (this.icon.data) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(this.icon.data)
    }

    return false;
  }

 }
