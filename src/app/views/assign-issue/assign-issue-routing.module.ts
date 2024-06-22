import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssignIssuePage } from './assign-issue.page';

const routes: Routes = [
  {
    path: '',
    component: AssignIssuePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssignIssuePageRoutingModule {}
