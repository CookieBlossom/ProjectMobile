import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterLinkWithHref } from '@angular/router';

import { TabsComponent } from './tabs.component';
@NgModule({
    declarations: [TabsComponent],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterLinkWithHref 
    ],
    exports: [TabsComponent],
    bootstrap: [TabsComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TabsModule {}
