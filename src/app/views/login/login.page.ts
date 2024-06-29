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
  loginForm: FormGroup; // Formulario reactivo para el inicio de sesión

  constructor(
    private fb: FormBuilder, // FormBuilder para crear el formulario reactivo
    private authService: AuthService, // Servicio de autenticación
    private router: Router, // Router para la navegación
    private toastController: NotificationService // Servicio de notificaciones para mostrar mensajes toast
  ) {
    // Inicialización del formulario reactivo con campos para correo electrónico y contraseña
    this.loginForm = this.fb.group({
      CT_Correo: ['', [Validators.required, Validators.email]], // Campo de correo electrónico con validaciones
      CT_Contrasena: ['', Validators.required], // Campo de contraseña con validación requerida
    });
  }

  ngOnInit() {}

  // Método para manejar el evento de inicio de sesión
  onLogin() {
    if (this.loginForm.valid) {
      // Si el formulario es válido, realizar el inicio de sesión llamando al servicio de autenticación
      this.authService.login(this.loginForm.value).subscribe(
        (response: any) => { // Respuesta del servicio de autenticación
          if (response.user && response.user.CN_ID_Rol !== undefined) {
            this.toastController.presentToast('Inicio de sesión exitoso', 'success'); // Mostrar mensaje de éxito
            // Redirigir al usuario según su rol
            switch (response.user.CN_ID_Rol) {
              case 2:
                this.router.navigate(['/user']); // Navegar a la página de usuario
                break;
              case 4:
                this.router.navigate(['/technician']); // Navegar a la página de técnico
                break;
              case 3:
                this.router.navigate(['/manager']); // Navegar a la página de gerente
                break;
              case 5:
                this.router.navigate(['/supervisor']); // Navegar a la página de supervisor
                break;
              case 1:
                this.router.navigate(['/administrator']); // Navegar a la página de administrador
                break;
              default:
                console.error('Unexpected role:', response.user.CN_ID_Rol); // Manejar roles inesperados
                break;
            }
          } else {
            // Mostrar mensaje de error si no se encuentra el rol del usuario
            this.toastController.presentToast('ERROR: No se encontró su rol, comuníquese con el administrador', 'danger');
          }
        },
        (error: any) => { // Manejo de errores en el inicio de sesión
          this.toastController.presentToast('ERROR: Credenciales inválidas', 'warning'); // Mostrar mensaje de error
        }
      );
    } else {
      this.markFormGroupTouched(this.loginForm); // Marcar los campos del formulario como tocados si no es válido
    }
  }

  // Método para marcar todos los controles de un formulario como tocados
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched(); // Marcar el control como tocado
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control); // Marcar controles anidados como tocados
      }
    });
  }
}
