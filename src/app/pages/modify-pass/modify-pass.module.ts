import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModifyPassPageRoutingModule } from './modify-pass-routing.module';

import { ModifyPassPage } from './modify-pass.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModifyPassPageRoutingModule
  ],
  declarations: [ModifyPassPage]
})
export class ModifyPassPageModule {}
