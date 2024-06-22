import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiagnosticIssuePageRoutingModule } from './diagnostic-issue-routing.module';

import { DiagnosticIssuePage } from './diagnostic-issue.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiagnosticIssuePageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [DiagnosticIssuePage]
})
export class DiagnosticIssuePageModule {}
