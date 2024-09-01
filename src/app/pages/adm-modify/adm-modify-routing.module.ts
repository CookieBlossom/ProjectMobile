import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdmModifyPage } from './adm-modify.page';

const routes: Routes = [
  {
    path: '',
    component: AdmModifyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdmModifyPageRoutingModule {}
