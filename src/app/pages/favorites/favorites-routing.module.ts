import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabsModule } from 'src/app/components/tabs/tabs.module';
import { FavoritesPage } from './favorites.page';

const routes: Routes = [
  {
    path: '',
    component: FavoritesPage
  }
];

@NgModule({
  imports: [RouterModule, TabsModule],
  exports: [RouterModule],
})
export class FavoritesPageRoutingModule {}
