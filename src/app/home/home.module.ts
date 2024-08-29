import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { TabsModule } from '../components/tabs/tabs.module';
import { RouterLinkWithHref } from '@angular/router';
import { HomePageRoutingModule } from './home-routing.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    TabsModule,
    RouterLinkWithHref,
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
