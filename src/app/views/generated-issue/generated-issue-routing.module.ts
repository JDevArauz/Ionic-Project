import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GeneratedIssuePage } from './generated-issue.page';

const routes: Routes = [
  {
    path: '',
    component: GeneratedIssuePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneratedIssuePageRoutingModule {}
