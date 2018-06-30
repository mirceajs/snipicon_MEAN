import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploadModule } from 'angular2-image-upload';

import { SIconComponent } from './sicon.component';
//import { SIconPrevewComponent } from './sicon-preview.component';
//import { SIconPreviewItemComponent } from './sicon-preview-item.component';
//import { UiSIconUploadComponent } from './sicon-upload.component';




@NgModule({
imports: [
  CommonModule,
  ImageUploadModule.forRoot(),
],
declarations: [
  SIconComponent,
 // SIconPrevewComponent,
 // SIconPreviewItemComponent,
 // UiSIconUploadComponent,
 ],
exports: [
  SIconComponent,
  //SIconPrevewComponent,
  //UiSIconUploadComponent,
],
}) export class UiSIconModule { };
