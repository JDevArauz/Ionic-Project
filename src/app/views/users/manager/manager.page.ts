import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.page.html',
  styleUrls: ['./manager.page.scss'],
})
export class ManagerPage implements OnInit {
  toast: any = true;
  userName: string = '';

  constructor(private navCtrl: NavController, private router: Router, private user: UserService) { }

  registrarIncidencia() {
    // Lógica para redirigir a la página de registro de incidencia
    this.navCtrl.navigateForward('/register-issue');
  }

  verIncidenciasGeneradas() {
    // Lógica para redirigir a la página de ver incidencias generadas
    this.router.navigate(['/incidents-view'],{ state: { toast: this.toast } });
  }

  asignarIncidencias() {
    // Lógica para redirigir a la página de realizar diagnóstico de incidencia
      this.router.navigate(['/incidents-view']);
      }

      verMisIncidenciasAsignadas() {
        // Lógica para redirigir a la página de ver mis incidencias asignadas
        this.router.navigate(['/incidents-view'],{ state: { toast: this.toast } });
  }
  verDiagnosticos() {
    // Lógica para redirigir a la página de ver mis diagnósticos
    this.router.navigate(['/diagnostics-view']);
  }

  ngOnInit() {
    this.user.getUser().then(user => {
      this.userName = user.CT_Nombre;
    });
  }

}
