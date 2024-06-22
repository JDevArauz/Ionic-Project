import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportsViewPageRoutingModule } from './reports-view-routing.module';

import { ReportsViewPage } from './reports-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportsViewPageRoutingModule
  ],
  declarations: [ReportsViewPage]
})
export class ReportsViewPageModule {}
