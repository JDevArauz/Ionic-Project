import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TechnicianPageRoutingModule } from './technician-routing.module';

import { TechnicianPage } from './technician.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TechnicianPageRoutingModule
  ],
  declarations: [TechnicianPage]
})
export class TechnicianPageModule {}
