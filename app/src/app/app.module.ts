import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CardsComponent } from './modules/cards/cards.component';
// jquery
declare var $;
import { DragDropModule } from '@angular/cdk/drag-drop';
import {HttpClientModule} from "@angular/common/http";
import { DashboardAdminComponent } from './modules/admin/dashboard-admin/dashboard-admin.component';
import { LoginAdminComponent } from './modules/admin/login-admin/login-admin.component';
import {FormsModule} from "@angular/forms";
import { BlockManagerComponent } from './modules/admin/block-manager/block-manager.component';
import {SessionManagerComponent} from './modules/admin/session-manager/session-manager.component';
import { NavLeftComponent } from './modules/admin/include/nav-left/nav-left.component';
import { NavHeaderComponent } from './modules/admin/include/nav-header/nav-header.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { BlockListComponent } from './modules/admin/include/block-list/block-list.component';
import {
  MAT_CHECKBOX_CLICK_ACTION, MatAutocompleteModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule,
  MatInputModule,
  MatNativeDateModule,
  MatRadioModule,
  MatSelectModule,
  MatSnackBarModule,
  MatTooltipModule
} from '@angular/material';
import {InputListBoxComponent} from './modules/admin/include/input-list-box/input-list-box.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import {StripHtml} from './pipes/stripHtml';
import {MaxChar} from './pipes/maxChar';
import { SessionComponent } from './modules/session/session.component';
import {SelectListBoxComponent} from './modules/admin/include/select-list-box/select-list-box.component';



@NgModule({
  declarations: [
    AppComponent,
    CardsComponent,
    DashboardAdminComponent,
    LoginAdminComponent,
    BlockManagerComponent,
    SessionManagerComponent,
    NavLeftComponent,
    NavHeaderComponent,
    BlockListComponent,
    InputListBoxComponent,
    SelectListBoxComponent,
    StripHtml,
    MaxChar,
    SessionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DragDropModule,
    HttpClientModule,
    FormsModule,
    FontAwesomeModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatNativeDateModule,
    MatSelectModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    CKEditorModule
  ],
  providers: [
    {provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'check'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
