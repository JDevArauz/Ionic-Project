import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./views/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./views/users/user/user.module').then(m => m.UserPageModule) // Protege la ruta user
  },
  {
    path: 'technician',
    loadChildren: () => import('./views/users/technician/technician.module').then(m => m.TechnicianPageModule) // Protege la ruta technician
  },
  {
    path: 'manager',
    loadChildren: () => import('./views/users/manager/manager.module').then(m => m.ManagerPageModule) // Protege la ruta manager
  },
  {
    path: 'supervisor',
    loadChildren: () => import('./views/users/supervisor/supervisor.module').then(m => m.SupervisorPageModule) // Protege la ruta supervisor
  },
  {
    path: 'administrator',
    loadChildren: () => import('./views/users/administrator-coming soon/administrator.module').then(m => m.AdministratorPageModule) // Protege la ruta administrator
  },
  {
    path: 'register-issue',
    loadChildren: () => import('./views/register-issue/register-issue.module').then(m => m.RegisterIssuePageModule) // Protege la ruta register-issue
  },
  {
    path: 'diagnostic-issue',
    loadChildren: () => import('./views/diagnostic-issue/diagnostic-issue.module').then(m => m.DiagnosticIssuePageModule) // Protege la ruta diagnostic-issue
  },
  {
    path: 'assign-issue',
    loadChildren: () => import('./views/assign-issue/assign-issue.module').then(m => m.AssignIssuePageModule) // Protege la ruta assign-issue
  },
  {
    path: 'incidents-view',
    loadChildren: () => import('./views/incidents-view/incidents-view.module').then(m => m.IncidentsViewPageModule) // Protege la ruta incidents-view
  },
  {
    path: 'diagnostics-view',
    loadChildren: () => import('./views/diagnostics-view/diagnostics-view.module').then( m => m.DiagnosticsViewPageModule)
  },
  {
    path: 'reports-view',
    loadChildren: () => import('./views/reports-view/reports-view.module').then( m => m.ReportsViewPageModule)
  },
  {
    path: '**',
    redirectTo: 'login'
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
