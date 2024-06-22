import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IncidentsViewPageRoutingModule } from './incidents-view-routing.module';

import { IncidentsViewPage } from './incidents-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    IncidentsViewPageRoutingModule
  ],
  declarations: [IncidentsViewPage]
})
export class IncidentsViewPageModule {}
