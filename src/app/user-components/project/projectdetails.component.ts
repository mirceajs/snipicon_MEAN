import { Component, OnInit,OnDestroy } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { ToolInjectionService } from '../.././toolbar-component/tool-injection.service';
import { ToolBar } from '../.././toolbar-component/toolbar-base';
import {ProjectModelComponent} from '../.././general-components/project-model/project-model.component';
import {SettModelComponent}  from '../.././general-components/set-model/set-model.component';
import {SetIconComponent}  from '../.././general-components/set-icon/set-icon.component';
import {IconAssemblerService} from '../.././services/icon-assembler.service';
import { Observable } from 'rxjs/Observable';
import * as forkJoin from 'rxjs/add/observable/forkJoin';
import * as _ from 'underscore';

@Component({
    selector: 'si-projectdetails',
    templateUrl: './projectdetails.component.html',
    styleUrls: ['./projectdetails.component.scss']
})
export class ProjectDetailsComponent implements OnInit,OnDestroy {
    ProjectList = [];
    subscription: Subscription;
    setItems = [];
    projrctaccrdArray = [];
    projrctaccrd ={id:'',set:[]};
    accordiostatusArray=[];
    accordiostatus ={id:'',status:''}
    loading = false;
    selectProj = {};
    selected = {};
    selectedPanel = [];
    constructor(public stoolbarService :ToolInjectionService,private activatedRoute: ActivatedRoute,
                private apollo :Apollo, public icn:IconAssemblerService,private sanitizer: DomSanitizer){
                 this.subscription = stoolbarService.loadst.subscribe(
                      data => {
                           setTimeout(() => {
                                   this.loadSet();
                            });
                         }, error => { console.log(error); })
   
    }
                        
    public ngOnInit() {
    let projectid;
    this.activatedRoute.params.subscribe((params: Params) => {
     this.selectProj = params['projid'];
     this.projrctaccrd = this.getPrjAccrdion(this.selectProj);
     this.loadProjects();
     this.loadSet(this.projrctaccrd.set);
    
    });
    }
    getPrjAccrdion(prjctid):any
    {
       this.projrctaccrdArray = JSON.parse(localStorage.getItem("SnipData")).projectAccrd ? JSON.parse(localStorage.getItem("SnipData")).projectAccrd :[];
       return this.projrctaccrdArray.find(prj => prj.id == prjctid) ? this.projrctaccrdArray.find(prj => prj.id == prjctid) : {id:this.selectProj,set:[]};
    }
    addIcon(set)
    {
      this.storeAccordionStatus();
      this.setToolbar(SetIconComponent,set); 
    }
    addnewSet()
    {
        this.selected = this.ProjectList.filter(proj => proj.ID==this.selectProj);
        this.setToolbar(SettModelComponent,this.selected); 
    }
    createProject()
    {
        this.selected = this.ProjectList.filter(proj => proj.ID==this.selectProj);
        console.log(this.selected);
        this.setToolbar(ProjectModelComponent, this.selected); 
    } 
    setToolbar(DynaminComponent,data) {
    this.stoolbarService
      .setPropertyPanel(new ToolBar(DynaminComponent, {
        details:data,
        prj: this.selected,
        headline: '',
        body: ''
      }));
    this.stoolbarService.setToolbar(new ToolBar(DynaminComponent, { name: 'Bombasto', bio: 'baraban' }));

  }

  panelOpened(id)
  {
   this.accordiostatus ={id:'',status:''} 
   let val = this.accordiostatusArray.find(acc => acc.id ==id)
   if(val!=undefined)
    this.accordiostatusArray.filter(acc=> acc.id ==id ? acc.status ="opened":acc.status = acc.status)
  else{  
  this.accordiostatus.id = id;
  this.accordiostatus.status="opened" ; 
  this.accordiostatusArray.push(this.accordiostatus); 
  } 
  }

  clicked(event)
  {
event.preventDefault(); 
  }

  panelClosed(id,event)
  {
   
   this.accordiostatus ={id:'',status:''}  
   let val = this.accordiostatusArray.find(acc => acc.id ==id)
   if(val!=undefined)
    this.accordiostatusArray.filter(acc=> acc.id ==id ? acc.status ="closed":acc.status = acc.status)
  else{  
  this.accordiostatus.id = id;
  this.accordiostatus.status="closed" ; 
  this.accordiostatusArray.push(this.accordiostatus); 
  } 
  }

  ngOnDestroy(){
   this.storeAccordionStatus();
  }

  storeAccordionStatus()
  {
   this.projrctaccrd.set = this.accordiostatusArray;
   if( this.projrctaccrdArray.find(prj => prj.id == this.selectProj)!= undefined)
   this.projrctaccrdArray.filter(prj => prj.id == this.selectProj ? prj.set = this.accordiostatusArray : prj.set = prj.set)
   else 
   this.projrctaccrdArray.push(this.projrctaccrd); 
   let storageData =  JSON.parse(localStorage.getItem("SnipData"));
   storageData.projectAccrd = this.projrctaccrdArray;
   localStorage.setItem("SnipData",JSON.stringify(storageData));
  }
  transformHTML(cont) {
    return this.sanitizer.bypassSecurityTrustHtml(cont);
  }

  panelClicked(flag,event)
  {
    if(!flag)
      event.preventDefault();
  }
  getClass(set)
  {
    return "snip_"+set.toString();
  }
  loadSet(prjSet?)
   {   
         let setAccrd =  this.projrctaccrd.set;
         let observableWatch = [];
         let setIcon :any = {Icons:[],set:{}};
         let setArray = [];
         let sets = [];
         let iconArray = [];  
         let projId = this.selectProj;
         this.loading = true;
         this.apollo.use('set').watchQuery<string>({
         query :gql`
                   query{ setByProject(project_id:"${projId}"){Name,ID,Type,Palette}}` }).refetch().then((data:any) =>{
                    if (data.data && data.data.setByProject && data.data.setByProject.length > 0){
                    sets = data.data.setByProject;
                    data.data.setByProject.forEach(set => {
                       observableWatch.push(
                       this.apollo.use('iconset').watchQuery<string>({
                            query :gql`query{
                            icons:iconsBySet(set_id:"${set.ID}"){_id :ID , name: Name,firstRegId : FirstRegID,tags:Tags,graphicsType:GraphicsType,Source,viewBox:ViewBox,
                                             cssStyle:CssStyle{name:Name,value:Body},
                                             Gradients{def: Def}}}` })
                                             .refetch().then()
                                            );
                        });   
                           combineLatest(observableWatch).subscribe(res=>{
                             res.forEach((data,index) =>{
                             setIcon = {
                                        Icons:[],set:{}
                                       };
                             setIcon.set = sets[index] ? sets[index] : [] ;
                             let setData = setAccrd.find(set=>set.id==setIcon.set.ID)
                             setIcon.status = setData && setData.status ? setData.status : 'closed';
                             this.icn.loadIcons(data).subscribe(res =>{
                                                this.generatePallet(_.first(setIcon.set.Palette).split(','),setIcon.set.ID) ; 
                                                iconArray = [];
                                                iconArray = res;
                                                setIcon.Icons = iconArray;
                                             });
                                            setArray.push(setIcon);  
                           });
                                         this.loading= false;
                           });     
                         this.setItems = setArray; 
                         console.log(this.setItems); 
                   }
                        else
                          this.loading = false; 
                    });
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

  projectChanged()
  {
   this.stoolbarService.clearPropertyPanel(); 
   this.storeAccordionStatus();
   this.setItems = null;
   this.loadSet();
  }
  
    generatePallet(colorStops,setid){
       let palletGrad
       this.icn.generateGradient(colorStops).subscribe(products => {
       var n = 21;
       palletGrad  = _.groupBy(products.grad, function(element, index){
         return Math.floor(index/n);
         });
       palletGrad = _.toArray(palletGrad); 
       this.icn.addStylesheetRules(palletGrad,setid);
    });
   
    }

}