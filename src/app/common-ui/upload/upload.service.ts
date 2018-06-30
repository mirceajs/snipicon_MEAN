import { Injectable } from '@angular/core';
import * as _ from 'underscore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map'
import { FetchResult } from 'apollo-link';
import { Http, Response } from '@angular/http';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable()
export class UploadService {
  public ObsArray =[];
  public IDs: FetchResult;
	constructor(private http: Http,private apollo: Apollo) { }
	
      uploadIcon(iconData) :Observable <FetchResult>
        {
         let userId = JSON.parse(localStorage.getItem("SnipData")) && JSON.parse(localStorage.getItem("SnipData")).userId  ? JSON.parse(localStorage.getItem("SnipData")).userId  : null; 
         this.ObsArray=[];
        
         let observable : Observable<FetchResult> =  this.apollo.use('upload').mutate({
            mutation : gql`
                     mutation  {
                      uploadHDIcons(name:"${iconData.name}",source:"${iconData.source}",id:"${iconData.id}",graphicsType:"${iconData.graphicsType}",
                                    firstRegId:"${iconData.firstRegId}",IconState:"${iconData.iconState}",tags:"${iconData.tags}",UserId:"${userId}"){
                           Source }}`
                      })
                      observable.subscribe(({ data }) => {
                                     
                                    this.IDs = data;
                                    return this.IDs;
                                    }, (error) => {
                                    console.log('there was an error sending the query', error);
                                   // IDs.push(error);
                                    return this.IDs;
                                    });
       
                   return Observable.of(this.IDs)
                      
                    /*  (result=>{
           
                 IDs.push(result); 
                return IDs;
              });*/
      //    return Observable.of(this.ObsArray = IDs);
}
}
