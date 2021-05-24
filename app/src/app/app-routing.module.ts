import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CardsComponent} from './modules/cards/cards.component';
import {LoginAdminComponent} from "./modules/admin/login-admin/login-admin.component";
import {BlockManagerComponent} from './modules/admin/block-manager/block-manager.component';
import {SessionManagerComponent} from './modules/admin/session-manager/session-manager.component';
import {SessionComponent} from './modules/session/session.component';


const routes: Routes = [
  {path: '', component: LoginAdminComponent},
  {path: 'cards', component: CardsComponent},
  {path: 'session/:id', component: SessionComponent},
  {path: 'session/:id/:share', component: SessionComponent},
  {path: 'admin/login', component: LoginAdminComponent},
  {path: 'admin/block-manager', component: BlockManagerComponent},
  {path: 'admin/session-manager', component: SessionManagerComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
