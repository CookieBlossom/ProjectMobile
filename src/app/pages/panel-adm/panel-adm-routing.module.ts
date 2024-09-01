import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PanelAdmPage } from './panel-adm.page';

const routes: Routes = [
  {
    path: '',
    component: PanelAdmPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PanelAdmPageRoutingModule {}
