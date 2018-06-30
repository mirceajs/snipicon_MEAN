import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'tag-input-item',
  template: `<div>{{text}}
              <span class="ng2-tag-input-remove" (click)="removeTag()">&times;</span>
            </div>`,
  styles: [`
            :host{
                   display: inline-block;
                   background: #ccc;
                   padding-left: 5px;
                   margin-right: 10px;
                }

            :host.ng2-tag-input-item-selected {
                  color: white;
                  background: #0d8bff;
                }

            .ng2-tag-input-remove {
                 cursor: pointer;
                 display: inline-block;
                 font-size :20px;
                 color: darkred;
                 margin-top:-5px;
                }
                `]
})
export class TagInputItemComponent {
  @Input() selected: boolean;
  @Input() text: string;
  @Input() index: number;
  @Output() tagRemoved: EventEmitter<number> = new EventEmitter();

  constructor() { }

  removeTag() {
    this.tagRemoved.emit(this.index);
  }
}