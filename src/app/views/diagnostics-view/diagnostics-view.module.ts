import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiagnosticsViewPageRoutingModule } from './diagnostics-view-routing.module';

import { DiagnosticsViewPage } from './diagnostics-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    DiagnosticsViewPageRoutingModule
  ],
  declarations: [DiagnosticsViewPage]
})
export class DiagnosticsViewPageModule {}
