import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProductsPageRoutingModule } from './products-routing.module';
import { ProductsPage } from './products.page';
import { TabsModule } from 'src/app/components/tabs/tabs.module';
import { RouterLinkWithHref } from '@angular/router';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule.forRoot(),
    TabsModule,
    RouterLinkWithHref,
    ProductsPageRoutingModule,
    MatSliderModule,
    MatSelectModule,
    MatButtonModule
  ],
  declarations: [ProductsPage]
})
export class ProductsPageModule {}
