import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PanelRoutingModule } from './panel-routing.module';
import { IndexComponent } from './index/index.component';
import { UserComponent } from './user/user.component';


@NgModule({
  declarations: [
    IndexComponent,
    UserComponent
  ],
  imports: [
    CommonModule,
    PanelRoutingModule
  ]
})
export class PanelModule { }
