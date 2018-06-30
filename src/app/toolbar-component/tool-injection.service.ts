import { Injectable ,EventEmitter} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { ToolBar } from './toolbar-base';

@Injectable()
export class ToolInjectionService {
  //private toolbarSource: Subject<ToolBar> = new Subject<ToolBar>();
  //private propertySource: Subject<ToolBar> = new Subject<ToolBar>();
   private toolbarSource: BehaviorSubject<any> = new BehaviorSubject<any>(null);
   private propertySource: BehaviorSubject<any> = new BehaviorSubject<any>(null);
   private loadProject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
   private loadSet: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public panelChanged: EventEmitter<any> = new EventEmitter<any>();
  toolbar$ = this.toolbarSource.asObservable();
  propertyPan$ = this.propertySource.asObservable();
  loadprjct = this.loadProject.asObservable();
  loadst = this.loadSet.asObservable();
  setToolbar(toolbar: ToolBar) {
      this.toolbarSource.next(toolbar);
  }

  reloadProject(){
    this.loadProject.next('test');
  }
  
  reloadSetinProject()
  {
    this.loadSet.next('new');  
  }
  clearToolbar() {
    this.toolbarSource.next(new ToolBar(String, { }));
  }

  setPropertyPanel(propertyPan: ToolBar) {
     this.propertySource.next(propertyPan);
    
  
  }

  clearPropertyPanel() {
    this.propertySource.next(new ToolBar(String, { }));
  }



}
