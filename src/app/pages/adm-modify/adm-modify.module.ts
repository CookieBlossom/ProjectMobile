import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdmModifyPageRoutingModule } from './adm-modify-routing.module';

import { AdmModifyPage } from './adm-modify.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdmModifyPageRoutingModule
  ],
  declarations: [AdmModifyPage]
})
export class AdmModifyPageModule {}
