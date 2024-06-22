import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GeneratedIssuePageRoutingModule } from './generated-issue-routing.module';

import { GeneratedIssuePage } from './generated-issue.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GeneratedIssuePageRoutingModule
  ],
  declarations: [GeneratedIssuePage]
})
export class GeneratedIssuePageModule {}
