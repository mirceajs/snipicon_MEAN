import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {UploadPanelComponent} from './upload-panel/uploadpanel.component';
import {TagInputItemComponent} from './tags/tag-input-data.component';
import {TagInputComponent} from './tags/tag-input.component';
import { ImageUploadModule } from 'angular2-image-upload';
import {UploadDataComponent,DialogConfirmBox} from './upload-panel/upload-data.component';
import {MatDialogModule} from '@angular/material/dialog';
import {UploadService} from './upload.service'
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
//const updateuri = 'http://localhost:4000/updateicons';
//const uri = 'http://localhost:4000/uploadicons';
const updateuri = 'http://35.171.8.196:4000/updateicons';
//const uri = 'http://35.171.8.196:4000/uploadicons';

@NgModule({
imports: [
  CommonModule,
  FormsModule,MatProgressSpinnerModule,
  MatDialogModule,MatSnackBarModule,
  ImageUploadModule.forRoot()
],
declarations: [
    UploadPanelComponent,TagInputItemComponent,TagInputComponent,UploadDataComponent,DialogConfirmBox
   ],
exports: [UploadPanelComponent,HttpClientModule,ApolloModule,HttpLinkModule],  
providers: [UploadService],
entryComponents: [DialogConfirmBox]

}) export class UploadModule { 
  constructor(apollo: Apollo,httpLink: HttpLink){
 
      apollo.create({
       link: httpLink.create({uri:updateuri}),
       cache: new InMemoryCache(),
    },'updateIcon');  
  }
};
