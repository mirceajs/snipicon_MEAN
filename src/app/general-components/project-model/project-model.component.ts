import {Component,OnInit,ViewChild,Input} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { FormBuilder, FormGroup, FormControl,  FormGroupDirective, NgForm } from '@angular/forms';
import {IconAssemblerService} from '../.././services/icon-assembler.service';
import * as _ from 'underscore';
import {ToolInjectionService} from '../.././toolbar-component/tool-injection.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
    templateUrl: './project-model.component.html',
    styleUrls: ['./project-model.component.scss']
})

export class ProjectModelComponent implements OnInit {
  project:any;
  colorStops: any = [];
  palletGrad:any;
  loading = false;
  @ViewChild('projects') private projects;
  public form;
  @Input() data: any;
  constructor(public icn:IconAssemblerService,private apollo: Apollo, public toolinjection : ToolInjectionService){
  }

  ngOnInit() {
    this.colorStops =  ['#FF3300','#FFaa00','#77BB00','#0099FF','#A89361','#6361B9','#904eb1','#707070']//['#FF0054', '#16C226', '#0099FF','#FF9500','#988BD9','#2EF374','#333333','#707070'];
    this.form = new FormGroup({
    project : new FormControl('',[])
   });
     
     this.colorStops = this.data && this.data.prj && this.data.prj[0] && this.data.prj[0].Palette ? this.data.prj[0].Palette[0].split(",") : this.colorStops;
     this.form.get('project').setValue(this.data && this.data.prj && this.data.prj[0] && this.data.prj[0].ProjectName ? this.data.prj[0].ProjectName : this.form.value.project);
     this.processGradient(this.colorStops); 
}

closePanel()
{
  this.toolinjection.clearPropertyPanel();
  
}

rgb(a,b,c)
{
 return "rgb("+a+","+b+","+c+")";
}

save()
{
  let name = this.form.value.project;
  let colors = this.colorStops;
  this.loading = true;
  let userId = JSON.parse(localStorage.getItem("SnipData")) && JSON.parse(localStorage.getItem("SnipData")).userId  ? JSON.parse(localStorage.getItem("SnipData")).userId  : null; 
  this.apollo.use('project').mutate({
         mutation :gql`
                   mutation{ postProject(name:"${name}", owner:"${userId}",palette:"${colors}"){
                    ID
                  }
                  }`
                },
                ).subscribe(res =>{
                    this.loading = false;
                    this.toolinjection.reloadProject();
                    this.closePanel();
                },
               (error) =>{
               this.loading = false;  
               })
}

colorChanged(color,index)
{
if(this.colorStops && this.colorStops[index])
   this.colorStops[index] = color;
   this.processGradient(this.colorStops);
}

 processGradient(color)
 {

  this.icn.generateGradient(this.colorStops).subscribe(color=>{
  this.palletGrad = _.groupBy(color.grad, function(element, index){
       return Math.floor(index/21);
        });
  this.palletGrad = _.toArray(this.palletGrad); 
  });
 }

}