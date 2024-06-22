import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportsViewPage } from './reports-view.page';

const routes: Routes = [
  {
    path: '',
    component: ReportsViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsViewPageRoutingModule {}
