import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-technician',
  templateUrl: './technician.page.html',
  styleUrls: ['./technician.page.scss'],
})
export class TechnicianPage implements OnInit {
  toast: any = true;
  userName: string = '';

  constructor(private user:UserService, private navCtrl: NavController, private router: Router) { }
  registrarIncidencia() {
    // Lógica para redirigir a la página de registro de incidencia
    this.navCtrl.navigateForward('/register-issue');
  }

  verIncidenciasGeneradas() {
    // Lógica para redirigir a la página de ver incidencias generadas
    this.router.navigate(['/incidents-view'],{ state: { toast: this.toast } });
  }

  realizarDiagnostico() {
    // Lógica para redirigir a la página de realizar diagnóstico de incidencia
      this.router.navigate(['/incidents-view']);
      }

      verMisIncidenciasAsignadas() {
        // Lógica para redirigir a la página de ver mis incidencias asignadas
        this.router.navigate(['/incidents-view'],{ state: { toast: this.toast } });
  }
  verIncidenciasDiagnosticadas() {
    // Lógica para redirigir a la página de ver mis diagnósticos
    this.router.navigate(['/diagnostics-view']);
  }
  ngOnInit() {
    this.user.getUser().then(user => {
      this.userName = user.CT_Nombre;
    });
  }
}

