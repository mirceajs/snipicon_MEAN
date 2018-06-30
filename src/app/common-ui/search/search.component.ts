import {Component,OnInit,Input,Output,EventEmitter} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Router } from '@angular/router';

@Component({
    selector: 'icon-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit {
  myControl: FormControl = new FormControl();
  filteredOptions: Observable<string[]>;
  isloading = false; 
  @Input() isSetIcon: boolean;
  @Output() searchText: EventEmitter<number> = new EventEmitter();
  constructor(private apollo: Apollo, private router: Router ) { }

  ngOnInit() {
  }
  
  search(txt){ 
  let text = txt.source && txt.source.value ? txt.source.value : txt.target && txt.target.value ? txt.target.value :'';
  this.filteredOptions = null; 
  console.log(this.isSetIcon);
  if(this.isSetIcon)
  this.searchText.emit(text);
  else  
  this.checkToken() ? this.router.navigate(['/searchresult/'+text]) : this.router.navigate(['/searchresultcold/'+text]) ;
  }

  checkToken()
    {
     let token = localStorage.getItem("SnipData");
     let tokenData= JSON.parse(token);
     return tokenData && tokenData.id && tokenData.userId && tokenData.userId.length > 0 ? true : false;
    }  

  searchTextField(text)
  {
    let searchResult = [];
    if(text.length > 2){
      this.isloading = true;  
      this.filter(text).subscribe(data =>{
      searchResult = data;
      this.filteredOptions = this.myControl.valueChanges
                             .pipe(startWith(''),
                              map(val =>searchResult)
                             );
                              this.isloading = false;
                             },(error) =>{
                               this.filteredOptions = null;
                               this.isloading = false;
                             })
                          }
    else
      this.filteredOptions = null; 
  }

  filter(val: string):Observable<string[]> {
   let strarray = [];
   return Observable.create(observer => {    this.apollo.watchQuery<any>({ 
                           query: gql`
                                  query {
                                         iconSearch: iconDbSearch(name:"${val}")
                                        }`,
                                  }).result().then(data => {
                                                   observer.next(data.data.iconSearch);
                                                   }, (error)=>{
                                                   return null;
                                                   })
                                                   });
                                  }
}