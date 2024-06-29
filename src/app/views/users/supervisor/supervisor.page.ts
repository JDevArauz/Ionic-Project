import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-supervisor',
  templateUrl: './supervisor.page.html',
  styleUrls: ['./supervisor.page.scss'],
})
export class SupervisorPage implements OnInit {
  userName: string = '';

  constructor(private navCtrl: NavController, private router: Router, private user: UserService) { }



  ngOnInit() {
    this.user.getUser().then(user => {
      this.userName = user.CT_Nombre;
    });
  }

  navigateToRegisterIssue() {
    this.router.navigate(['/register-issue']);
  }
  navigateToGeneratedIssues() {
    this.router.navigate(['/incidents-view'], { state: { toast: 0 } });
  }

  verDiagnosticos() {
    // Lógica para redirigir a la página de ver mis diagnósticos
    this.router.navigate(['/diagnostics-view'],{ state: { toast: 1 } });
  }

  viewReports() {
    // Lógica para redirigir a la página de ver reportes
    this.router.navigate(['/reports-view']);
  }
}
