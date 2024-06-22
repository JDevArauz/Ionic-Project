import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiagnosticIssuePage } from './diagnostic-issue.page';

const routes: Routes = [
  {
    path: '',
    component: DiagnosticIssuePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiagnosticIssuePageRoutingModule {}
