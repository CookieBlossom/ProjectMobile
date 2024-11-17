import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModifyPassPage } from './modify-pass.page';

const routes: Routes = [
  {
    path: '',
    component: ModifyPassPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModifyPassPageRoutingModule {}
