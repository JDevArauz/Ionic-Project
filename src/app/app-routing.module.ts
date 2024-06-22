import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard'; // Importa el AuthGuard

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
    loadChildren: () => import('./views/users/user/user.module').then(m => m.UserPageModule),
    canActivate: [AuthGuard] // Protege la ruta user
  },
  {
    path: 'technician',
    loadChildren: () => import('./views/users/technician/technician.module').then(m => m.TechnicianPageModule),
    canActivate: [AuthGuard] // Protege la ruta technician
  },
  {
    path: 'manager',
    loadChildren: () => import('./views/users/manager/manager.module').then(m => m.ManagerPageModule),
    canActivate: [AuthGuard] // Protege la ruta manager
  },
  {
    path: 'supervisor',
    loadChildren: () => import('./views/users/supervisor/supervisor.module').then(m => m.SupervisorPageModule),
    canActivate: [AuthGuard] // Protege la ruta supervisor
  },
  {
    path: 'administrator',
    loadChildren: () => import('./views/users/administrator-coming soon/administrator.module').then(m => m.AdministratorPageModule),
    canActivate: [AuthGuard] // Protege la ruta administrator
  },
  {
    path: 'register-issue',
    loadChildren: () => import('./views/register-issue/register-issue.module').then(m => m.RegisterIssuePageModule),
    canActivate: [AuthGuard] // Protege la ruta register-issue
  },
  {
    path: 'generated-issue',
    loadChildren: () => import('./views/generated-issue/generated-issue.module').then(m => m.GeneratedIssuePageModule),
    canActivate: [AuthGuard] // Protege la ruta generated-issue
  },
  {
    path: 'diagnostic-issue',
    loadChildren: () => import('./views/diagnostic-issue/diagnostic-issue.module').then(m => m.DiagnosticIssuePageModule),
    canActivate: [AuthGuard] // Protege la ruta diagnostic-issue
  },
  {
    path: 'assign-issue',
    loadChildren: () => import('./views/assign-issue/assign-issue.module').then(m => m.AssignIssuePageModule),
    canActivate: [AuthGuard] // Protege la ruta assign-issue
  },
  {
    path: 'incidents-view',
    loadChildren: () => import('./views/incidents-view/incidents-view.module').then(m => m.IncidentsViewPageModule),
    canActivate: [AuthGuard] // Protege la ruta incidents-view
  },
  {
    path: 'diagnostics-view',
    loadChildren: () => import('./views/diagnostics-view/diagnostics-view.module').then( m => m.DiagnosticsViewPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'reports-view',
    loadChildren: () => import('./views/reports-view/reports-view.module').then( m => m.ReportsViewPageModule),
    canActivate: [AuthGuard]
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
