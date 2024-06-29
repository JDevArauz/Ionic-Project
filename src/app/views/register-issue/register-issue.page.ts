import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CameraService } from '../../helpers/camera.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../helpers/notification.service';
import { EmailService } from '../../services/email.service';
import { LoadingService } from '../../helpers/loading.service';
import { LogsService } from 'src/app/services/logs.service';

@Component({
  selector: 'app-register-issue',
  templateUrl: './register-issue.page.html',
  styleUrls: ['./register-issue.page.scss'],
})
export class RegisterIssuePage {
  api: any = this.authService.getApiUrl(); // URL de la API
  registroForm: FormGroup; // Formulario reactivo para el registro de incidencias
  photos: string[] = []; // Array para almacenar las fotos tomadas
  incidencias: any[] = []; // Array para almacenar las incidencias generadas

  constructor(
    private formBuilder: FormBuilder, // FormBuilder para crear el formulario reactivo
    private cameraService: CameraService, // Servicio para tomar y subir fotos
    private http: HttpClient, // HttpClient para hacer peticiones HTTP
    private emaiService: EmailService, // Servicio para enviar correos electrónicos
    private authService: AuthService, // Servicio de autenticación
    private toastController: NotificationService, // Servicio de notificaciones para mostrar mensajes toast
    private loadingService: LoadingService, // Servicio de carga para mostrar indicadores de carga
    private logs: LogsService // Servicio para guardar logs
  ) {
    // Inicialización del formulario reactivo con campos para el título, descripción y lugar de la incidencia
    this.registroForm = this.formBuilder.group({
      CT_Titulo_Incidencia: ['', Validators.required], // Campo para el título de la incidencia
      CT_Descripcion_Incidencia: ['', Validators.required], // Campo para la descripción de la incidencia
      CT_Lugar_Incidencia: ['', Validators.required], // Campo para el lugar de la incidencia
    });
  }

  async reset() {
    // Método para resetear el formulario y limpiar las fotos
    this.registroForm.reset();
    this.photos = [];
  }

  ngOnInit() {
    // Método de inicialización para cargar las incidencias generadas
    this.loadIncidenciasGeneradas();
  }

  async onSubmit() {
    // Método para manejar el envío del formulario
    if (this.registroForm.valid) {
      const formValues = this.registroForm.value; // Obtener los valores del formulario
      const url_incident = `${this.api}/incidents`; // URL para registrar la incidencia
      const url_image = `${this.api}/images`; // URL para subir las imágenes
      try {
        const token = await this.authService.getAccessToken(); // Obtener el token de autenticación
        if (token) {
          const decodedToken = this.authService.decodeToken(token); // Decodificar el token para obtener el ID del usuario
          const CN_ID_Usuario = decodedToken.CN_ID_Usuario;
          formValues.CN_ID_Usuario = CN_ID_Usuario; // Agregar el ID del usuario a los datos del formulario
          formValues.CN_ID_Estado_Incidencia = 1; // Estado inicial de la incidencia

          // Enviar la solicitud con los datos del formulario
          const response: any = await this.http.post(url_incident, formValues).toPromise();

          for (const photo of this.photos) {
            const matches = photo.match(/^data:(image\/(\w+));base64,(.+)$/);
            if (matches && matches.length === 4) {
              const CT_Descripcion = matches[1]; // Tipo de imagen completo (por ejemplo, "image/jpeg")
              const CT_Tipo = matches[2]; // Formato de la imagen (por ejemplo, "jpeg")
              // Almacenar los componentes de la imagen en el array separado
              await this.http.post(url_image, {
                CN_ID_Incidente: response.data.CN_ID_Incidente,
                CN_ID_Usuario: CN_ID_Usuario,
                CT_Descripcion: CT_Descripcion,
                CT_Tipo: CT_Tipo,
                CN_Datos: photo
              }).toPromise();
            } else {
              console.error("La cadena de datos de la imagen no tiene el formato esperado.");
            }
          }

          await this.loadingService.presentLoading('Cargando...'); // Mostrar indicador de carga

          // Guardar log de la incidencia registrada
          this.logs.saveGeneralLog({
            CN_ID_Usuario: CN_ID_Usuario,
            CN_ID_Pantalla: 1,
            CN_ID_Sistema: 1,
            CT_Referencia: `REGISTRO INCIDENCIA: ${formValues.CT_Titulo_Incidencia} - LUGAR: ${formValues.CT_Lugar_Incidencia} - DESCRIPCION: ${formValues.CT_Descripcion_Incidencia}`
          }).then(() => {
            // Enviar correo de notificación
            this.emaiService.sendEmail(
              'josuehernandezarauz@gmail.com',
              'Incidencia registrada',
              'Se ha registrado una nueva incidencia en el sistema.'
            ).subscribe(
              () => {
                this.toastController.presentToast('Incidencia registrada correctamente.', 'success'); // Mostrar mensaje de éxito
                this.reset(); // Resetear el formulario y limpiar las fotos
                this.loadIncidenciasGeneradas(); // Cargar incidencias generadas
              },
              (error) => {
                this.toastController.presentToast('ERROR: No se pudo enviar el correo electrónico de notificación.', 'warning'); // Mostrar mensaje de error
              }
            );
          });
        } else {
          this.toastController.presentToast('ERROR: Usuario NO autenticado.', 'warning'); // Mostrar mensaje de error
        }
      } catch (error) {
        this.toastController.presentToast('ERROR: No se pudo registrar la incidencia.', 'warning'); // Mostrar mensaje de error
      }
    } else {
      this.toastController.presentToast('ERROR: Formulario incompleto, por favor, completa todos los campos requeridos', 'warning'); // Mostrar mensaje de error
      Object.keys(this.registroForm.controls).forEach(field => {
        const control = this.registroForm.get(field);
        control?.markAsTouched({ onlySelf: true }); // Marcar el campo como tocado
        control?.markAsDirty({ onlySelf: true }); // Marcar el campo como sucio
      });
    }
    await this.loadingService.dismissLoading(); // Ocultar indicador de carga
  }

  loadIncidenciasGeneradas() {
    // Método para cargar las incidencias generadas
    this.authService.getUserFromToken().then((token) => {
      this.http
        .get<any[]>(`${this.api}/incidents/${token.CN_ID_Usuario}`)
        .subscribe(
          (data) => {
            this.incidencias = data; // Asignar los datos de las incidencias al array
            console.log('Incidencias generadas', data);
          },
          (error) => {
            console.error('Error al recuperar incidentes generados', error); // Manejar error
          }
        );
    });
  }

  async tomarFoto() {
    // Método para tomar una foto
    try {
      const photo = await this.cameraService.tomarFoto(); // Tomar foto
      this.photos.push(photo); // Agregar la foto al array de fotos
    } catch (error) {
      this.toastController.presentToast('ERROR: No se pudo tomar la foto.', 'warning'); // Mostrar mensaje de error
    }
  }

  async subirFotos() {
    // Método para subir fotos
    try {
      const photo = await this.cameraService.subirFoto(); // Subir foto
      if (!photo) {
        console.error('No se seleccionó ninguna foto.'); // Manejar error
        return;
      }
      this.photos.push(photo); // Agregar la foto al array de fotos
    } catch (error) {
      this.toastController.presentToast('ERROR: No se pudo subir la foto.', 'warning'); // Mostrar mensaje de error
    }
  }

  eliminarFoto(index: number) {
    // Método para eliminar una foto del array de fotos
    if (index >= 0 && index < this.photos.length) {
      this.photos.splice(index, 1); // Eliminar foto del array
      this.toastController.presentToast('Foto eliminada correctamente.', 'success'); // Mostrar mensaje de éxito
    } else {
      console.error('Índice de foto fuera de rango:', index); // Manejar error
    }
  }
}
