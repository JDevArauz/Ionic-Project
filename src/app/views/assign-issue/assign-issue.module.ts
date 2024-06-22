import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssignIssuePageRoutingModule } from './assign-issue-routing.module';

import { AssignIssuePage } from './assign-issue.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AssignIssuePageRoutingModule
  ],
  declarations: [AssignIssuePage]
})
export class AssignIssuePageModule {}
