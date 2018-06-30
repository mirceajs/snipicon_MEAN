import { Routes } from '@angular/router';
import {FoundryComponent} from './foundry/foundry.component';
import {ProjectComponent} from './project/project.component';
import {VaultComponent} from './vault/vault.component';
import {ProjectDetailsComponent} from './project/projectdetails.component';

export const ROUTES: Routes = [
  
      { path: 'project', component: ProjectComponent },
      { path: 'vault', component: VaultComponent },
      { path: 'foundry', component: FoundryComponent },
      { path :'projectdetails/:projid', component:ProjectDetailsComponent},
];
