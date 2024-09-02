import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PanelAddPage } from './panel-add.page';

const routes: Routes = [
  {
    path: '',
    component: PanelAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PanelAddPageRoutingModule {}
