import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterIssuePage } from './register-issue.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterIssuePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterIssuePageRoutingModule {}
