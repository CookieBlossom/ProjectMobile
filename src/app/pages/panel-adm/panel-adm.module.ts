import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PanelAdmPageRoutingModule } from './panel-adm-routing.module';

import { PanelAdmPage } from './panel-adm.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PanelAdmPageRoutingModule
  ],
  declarations: [PanelAdmPage]
})
export class PanelAdmPageModule {}
