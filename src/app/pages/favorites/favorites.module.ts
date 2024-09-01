import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TabsModule } from 'src/app/components/tabs/tabs.module';
import { FavoritesPage } from './favorites.page';
import { FavoritesPageRoutingModule } from './favorites-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsModule,
    FavoritesPageRoutingModule,
  ],
  declarations: [FavoritesPage]
})
export class FavoritesPageModule {}
