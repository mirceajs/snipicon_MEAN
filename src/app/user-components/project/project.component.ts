import { Component, OnInit } from '@angular/core';
import { VaultComponent} from '.././vault/vault.component';
import { ToolInjectionService } from '../.././toolbar-component/tool-injection.service';
import { ToolBar } from '../.././toolbar-component/toolbar-base';
import {ProjectModelComponent} from '../.././general-components/project-model/project-model.component';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

@Component({
    selector: 'si-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
    ProjectList = [];
    subscription: Subscription;
    constructor( private apollo: Apollo, private stoolbarService: ToolInjectionService, private router: Router) {
            this.subscription = stoolbarService.propertyPan$.subscribe(
      data => {
        setTimeout(() => {
                 this.loadProjects();
        });
      }, error => { console.log(error); }
    )
     }

    public ngOnInit() {
     this.loadProjects(); 
    }
    createProject()
    {
        this.setToolbar(ProjectModelComponent); 
    } 
    setToolbar(DynaminComponent) {
    this.stoolbarService
      .setPropertyPanel(new ToolBar(DynaminComponent, {
        headline: '',
        body: ''
      }));
    this.stoolbarService.setToolbar(new ToolBar(DynaminComponent, { name: 'Bombasto', bio: 'baraban' }));

  }
  projectDetails(prjid)
  {
  this.router.navigate(['/sicon/projectdetails/'+prjid]) 
  }

  loadProjects(){

    let userId = JSON.parse(localStorage.getItem("SnipData")) && JSON.parse(localStorage.getItem("SnipData")).userId  ? JSON.parse(localStorage.getItem("SnipData")).userId  : null; 
    this.apollo.use('project').watchQuery<string>({
         query :gql`
                   query{ projectByOwner(user:"${userId}"){
                    ID,ProjectName,Palette}}` }).refetch().then((data:any) =>{
                     this.ProjectList =  data.data.projectByOwner;
                    });
 
}
}