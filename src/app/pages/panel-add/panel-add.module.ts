import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PanelAddPageRoutingModule } from './panel-add-routing.module';

import { PanelAddPage } from './panel-add.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PanelAddPageRoutingModule
  ],
  declarations: [PanelAddPage]
})
export class PanelAddPageModule {}
