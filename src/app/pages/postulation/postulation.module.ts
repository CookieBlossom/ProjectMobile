import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostulationPageRoutingModule } from './postulation-routing.module';

import { PostulationPage } from './postulation.page';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostulationPageRoutingModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  declarations: [PostulationPage],
})
export class PostulationPageModule {}
