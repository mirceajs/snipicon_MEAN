import {Component,OnInit,ViewChild,Input,Inject,EventEmitter,Output} from '@angular/core';
import { FileHolder } from 'angular2-image-upload/lib/image-upload/image-upload.component';
import { ImageUploadComponent} from 'angular2-image-upload/lib/image-upload/image-upload.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {SIcon} from '.././model/sicon.model';
@Component({
  selector: 'upload-data',
  template: `     <div id ="{{iconId}}" [hidden]="true" (click)="iconDelete()">delete</div>
                  <image-upload [url]="url" [max]="1" [uploadedFiles]="images" 
                                 [buttonCaption]="''" [dropBoxMessage]="''"
                                 [partName]="'file'" [withCredentials]="true" (dblclick)="imgUpload()"  (onRemove)="onRemoved($event)"
                                 (uploadFinished)="onUploadFinished($event)" (isPending)="onUploadStateChanged($event)" #imageUpload>
                  </image-upload>`,

})
export class UploadDataComponent implements OnInit {
  
  @ViewChild(ImageUploadComponent) imageUploadComponent: ImageUploadComponent;
  @Input() url: string;
  @Input() gliph: SIcon;
  @Input() iconId: string;
  @ViewChild('imageUpload') private imageUpload: any;
  @Output() setPrefix = new EventEmitter();

  file:FileHolder;
  images:any =[];
 
  constructor(public dialog: MatDialog) { }
  public ngOnInit() {
       if(this.gliph && this.gliph.source && this.gliph.source.length > 0 )
           this.images[0] = this.gliph.source;   
  }
 
  
  public imgUpload()
   {
     
     if(this.imageUploadComponent.fileCounter < 1 && this.imageUploadComponent.uploadedFiles.length < 1)
     this.imageUpload.inputElement.nativeElement.click();
     else 
      {
       let dialogRef;
        dialogRef = this.dialog.open(DialogConfirmBox, {
        width: '500px'
      });
     }
   }

    public iconDelete(){
     
     this.imageUploadComponent.deleteAll();
     this.imageUploadComponent.uploadedFiles= [];
    }  

    public deleteIcon(seltwin){
      
        let element: HTMLElement = document.getElementById(seltwin.iconType) as HTMLElement;
        element.click();
      }
  

    public onRemoved(file: FileHolder) {
     }

    public onUploadFinished(file: FileHolder) {
    let prefixId = Math.random().toString(36).substr(2,10);
       this.gliph.source = file.src;
       this.setPrefix.emit(prefixId);
     }

    public onUploadStateChanged(state: boolean) {
    
    } 
  
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-removeicon',
  template: `<div style="padding:10px">Please remove the current icons and then upload new one</div>
             <button class="btn btn-sm btn-primary pull-right" style="margin:5px" (click)="closeAlert()">OK</button>  `
})
// tslint:disable-next-line:component-class-suffix
export class DialogConfirmBox {
  constructor(public dialogRef: MatDialogRef<UploadDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  closeAlert(): void {
    this.dialogRef.close();
  }

}
