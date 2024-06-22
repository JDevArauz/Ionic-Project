import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../helpers/notification.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastController: NotificationService
  ) {
    this.loginForm = this.fb.group({
      CT_Correo: ['', [Validators.required, Validators.email]],
      CT_Contrasena: ['', Validators.required],
    });
  }

  ngOnInit() {}

  onLogin() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        (response: any) => { // Specify the type of 'response' as 'any'
          if (response.user && response.user.CN_ID_Rol !== undefined) {
            this.toastController.presentToast('Inicio de sesión exitoso', 'success');
            switch (response.user.CN_ID_Rol) {
              case 2:
                this.router.navigate(['/user']);
                break;
              case 4:
                this.router.navigate(['/technician']);
                break;
              case 3:
                this.router.navigate(['/manager']);
                break;
              case 5:
                this.router.navigate(['/supervisor']);
                break;
              case 1:
                this.router.navigate(['/administrator']);
                break;
              default:
                console.error('Unexpected role:', response.user.CN_ID_Rol);
                break;
            }
          } else {
            this.toastController.presentToast('ERROR: No se encontró su rol, comuníquese con el administrador', 'danger');
          }
        },
        (error: any) => { // Specify the type of 'error' as 'any'
          this.toastController.presentToast('ERROR: Credenciales inválidas', 'warning');
          // Manejar el error de inicio de sesión
        }
      );
    }
  }
}
