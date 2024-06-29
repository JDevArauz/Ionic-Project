import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LoadingService } from '../../helpers/loading.service';
import { NotificationService } from '../../helpers/notification.service';
import { CameraService } from '../../helpers/camera.service';
import { EmailService } from '../../services/email.service';
import { LogsService } from '../../services/logs.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-diagnostic-issue',
  templateUrl: './diagnostic-issue.page.html',
  styleUrls: ['./diagnostic-issue.page.scss'],
})
export class DiagnosticIssuePage implements OnInit {
  api: any = this.authService.getApiUrl(); // URL de la API obtenida del servicio de autenticación
  diagnosticForm: FormGroup; // Formulario reactivo para el diagnóstico
  incidencia: any; // Información de la incidencia actual
  photos: string[] = []; // Arreglo para almacenar fotos tomadas

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private loadingService: LoadingService,
    private notificationService: NotificationService,
    private cameraService: CameraService,
    private emailService: EmailService,
    private logs: LogsService,
    private navCtrl: NavController
  ) {
    // Inicialización del formulario reactivo con validaciones
    this.diagnosticForm = this.formBuilder.group({
      CT_Diagnostico: ['', Validators.required],
      CN_Requiere_Compra: ['', Validators.required],
      CN_Tiempo_Solucion_Estimado: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      CT_Costo_Estimado: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      CT_Observaciones: ['', Validators.required],
    });
  }

  ngOnInit() {
    // Verificar si hay una incidencia en el estado del historial
    if (history.state && history.state.incidencia) {
      this.incidencia = history.state.incidencia;
    } else {
      console.error('No se pudo encontrar la incidencia en el estado de la historia.');
    }
  }

  // Método para reiniciar el formulario y variables
  async reset() {
    this.diagnosticForm.reset();
    this.incidencia = null;
    this.photos = [];
  }

  // Método para manejar el envío del formulario
  async onSubmit() {
    if (this.diagnosticForm && this.diagnosticForm.valid) {
      const url_image = `${this.api}/images`;
      try {
        const token = await this.authService.getAccessToken();
        if (token) {
          const decodedToken = await this.authService.decodeToken(token);
          const CN_ID_Usuario = decodedToken.CN_ID_Usuario;
          const formValues = this.diagnosticForm.value;
          formValues.CN_ID_Incidente = this.incidencia.CN_ID_Incidente;
          formValues.CN_ID_Usuario = CN_ID_Usuario;
          formValues.CN_ID_Estado_Incidencia = 3; // Estado de diagnóstico
          formValues.CN_Requiere_Compra = formValues.CN_Requiere_Compra ? "Si" : "No";

          // Enviar datos del diagnóstico a la API
          const response: any = await this.http.post(`${this.api}/diagnostics`, formValues).toPromise();

          // Si hay fotos, subirlas a la API
          if (this.photos.length !== 0) {
            for (const photo of this.photos) {
              const matches = photo.match(/^data:(image\/(\w+));base64,(.+)$/);
              if (matches && matches.length === 4) {
                const CT_Descripcion = matches[1];
                const CT_Tipo = matches[2];
                await this.http.post(url_image, {
                  CN_ID_Incidente: this.incidencia.CN_ID_Incidente,
                  CN_ID_Diagnostico: response.data.CN_ID_Diagnostico,
                  CN_ID_Usuario: CN_ID_Usuario,
                  CT_Descripcion: CT_Descripcion,
                  CT_Tipo: CT_Tipo,
                  CN_Datos: photo
                }).toPromise();
              } else {
                console.error("La cadena de datos de la imagen no tiene el formato esperado.");
              }
            }
          }

          await this.loadingService.presentLoading('Cargando...');
          // Guardar un registro en el log
          await this.logs.saveGeneralLog({
            CN_ID_Usuario: CN_ID_Usuario,
            CN_ID_Pantalla: 2,
            CN_ID_Sistema: 1,
            CT_Referencia: `REGISTRO DIAGNOSTICO:${this.incidencia.CT_Titulo_Incidencia}-DIAGNOSTICO:${formValues.CT_Diagnostico}-REQUIERE COMPRA:${formValues.CN_Requiere_Compra}-TIEMPO SOLUCION:${formValues.CN_Tiempo_Solucion_Estimado}-OBSERVACIONES:${formValues.CT_Observaciones}`
          });

          // Obtener usuario actual y registrar cambios en el log
          const user = await this.authService.getUserFromToken();
          const dataLog = {
            CN_ID_Usuario: user.CN_ID_Usuario,
            CN_ID_Incidente: this.incidencia.CN_ID_Incidente,
            CN_Estado_Actual: 3,
            CN_Nuevo_Estado: 4,
          };
          this.http.post(`${this.api}/logsE`, dataLog).subscribe(
            (data) => {
              const dataLog = {
                CN_ID_Usuario: user.CN_ID_Usuario,
                CN_ID_Incidente: this.incidencia.CN_ID_Incidente,
                CN_Estado_Actual: 4,
                CN_Nuevo_Estado: 6,
              };

              // Enviar registro de log
              this.http.post(`${this.api}/logsE`, dataLog).subscribe(
                (data) => {
                  // Actualizar el estado de la incidencia
                  this.http.put(`${this.api}/incidents/${this.incidencia.CN_ID_Incidente}`, {CN_ID_Estado_Incidencia: 6}).subscribe(
                    (data) => {
                      console.log('Incidencia actualizada', data);
                    },
                    (error) => {
                      console.error('Error al actualizar la incidencia', error);
                    }
                  );
                },
                (error) => {
                  console.error('Error al crear el log', error);
                }
              );

            },
            (error) => {
              console.error('Error al crear el log', error);
            }
          );

          // Enviar correo de notificación
          this.emailService.sendEmail('josuehernandezarauz@gmail.com', 'Diagnostico registrado', 'Se ha registrado un nuevo diagnóstico en el sistema.')
            .subscribe(
              () => this.notificationService.presentToast('Diagnóstico enviado correctamente', 'success'),
            );
          // Navegar hacia atrás
          this.navCtrl.back();
        } else {
          this.notificationService.presentToast('No se pudo obtener el token de acceso', 'danger');
        }
      } catch (error) {
        this.notificationService.presentToast('Error al enviar el diagnóstico', 'danger');
      } finally {
        this.loadingService.dismissLoading();
      }
    } else {
      this.notificationService.presentToast('Por favor, complete el formulario', 'warning');
      this.markFormControlsAsTouchedAndDirty();
    }
  }

  // Método para marcar los controles del formulario como tocados y sucios
  private markFormControlsAsTouchedAndDirty() {
    Object.keys(this.diagnosticForm.controls).forEach(field => {
      const control = this.diagnosticForm.get(field);
      control?.markAsTouched({ onlySelf: true });
      control?.markAsDirty({ onlySelf: true });
    });
  }

  // Métodos para seleccionar opciones en el formulario
  selectSi() {
    this.diagnosticForm.controls['CN_Requiere_Compra'].setValue(1);
  }

  selectNo() {
    this.diagnosticForm.controls['CN_Requiere_Compra'].setValue(0);
  }

  // Método para tomar una foto usando el servicio de la cámara
  async tomarFoto() {
    try {
      const photo = await this.cameraService.tomarFoto();
      this.photos.push(photo);
    } catch (error) {
      this.notificationService.presentToast('ERROR: No se pudo tomar la foto.', 'warning');
    }
  }

  // Método para subir una foto desde la galería usando el servicio de la cámara
  async subirFotos() {
    try {
      const photo = await this.cameraService.subirFoto();
      if (!photo) {
        console.error('No se seleccionó ninguna foto.');
        return;
      }
      this.photos.push(photo);
    } catch (error) {
      this.notificationService.presentToast('ERROR: No se pudo subir la foto.', 'warning');
    }
  }

  // Método para eliminar una foto del arreglo de fotos
  eliminarFoto(index: number) {
    if (index >= 0 && index < this.photos.length) {
      this.photos.splice(index, 1);
      this.notificationService.presentToast('Foto eliminada correctamente.', 'success');
    } else {
      console.error('Índice de foto fuera de rango:', index);
    }
  }
}
