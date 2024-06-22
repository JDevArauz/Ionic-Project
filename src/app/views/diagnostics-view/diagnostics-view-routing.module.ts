import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiagnosticsViewPage } from './diagnostics-view.page';

const routes: Routes = [
  {
    path: '',
    component: DiagnosticsViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiagnosticsViewPageRoutingModule {}
