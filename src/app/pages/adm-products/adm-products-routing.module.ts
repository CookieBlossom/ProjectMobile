import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdmProductsPage } from './adm-products.page';

const routes: Routes = [
  {
    path: '',
    component: AdmProductsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdmProductsPageRoutingModule {}
