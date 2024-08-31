import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProductsPageRoutingModule } from './products-routing.module';
import { ProductsPage } from './products.page';
import { TabsModule } from 'src/app/components/tabs/tabs.module';
import { RouterLinkWithHref } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule.forRoot(),
    TabsModule,
    RouterLinkWithHref,
    ProductsPageRoutingModule,
  ],
  declarations: [ProductsPage]
})
export class ProductsPageModule {}
