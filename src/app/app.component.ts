import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  usuarioAutenticado: boolean = false;

  constructor(
    private platform: Platform,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();
    await this.verificarAutenticacion();
  }

  async ngOnInit() {
    await this.verificarAutenticacion();
  }

  async verificarAutenticacion() {
    const token = await this.authService.getAccessToken();
    if (token) {
      this.usuarioAutenticado = true;
      this.router.navigate(['/home']); // Redirigir a la página principal
    } else {
      this.usuarioAutenticado = false;
      this.router.navigate(['/login']); // Redirigir al inicio de sesión
    }
  }
}
