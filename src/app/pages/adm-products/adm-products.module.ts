import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdmProductsPageRoutingModule } from './adm-products-routing.module';

import { AdmProductsPage } from './adm-products.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdmProductsPageRoutingModule
  ],
  declarations: [AdmProductsPage]
})
export class AdmProductsPageModule {}
