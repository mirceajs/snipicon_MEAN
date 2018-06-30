import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { SearchComponent} from './search.component';
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {IconAssemblerService} from '../../services/icon-assembler.service';
import { SearchResultComponent} from './searchResult.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { HttpModule } from '@angular/http';
import {SearchSelectionComponent} from './searchSelection.component';
//const uri = 'http://localhost:4000/icons';
const uri = 'http://35.171.8.196:4000/icons';

@NgModule({
imports: [
  CommonModule,HttpModule,
  FormsModule,HttpLinkModule,
  MatAutocompleteModule,ApolloModule,
  ReactiveFormsModule,MatInputModule,
  MatSelectModule,MatSnackBarModule,MatProgressSpinnerModule
 ],
providers: [IconAssemblerService],
declarations: [
    SearchComponent,SearchResultComponent,SearchSelectionComponent
   ],
exports: [
    SearchComponent ,SearchResultComponent,SearchSelectionComponent
],
 
}) export class SearchModule {
    constructor(apollo: Apollo,httpLink: HttpLink){
       apollo.create({
       link: httpLink.create({ uri }),
       cache: new InMemoryCache(),
    });
  }
 };
