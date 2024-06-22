import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CameraService } from '../../helpers/camera.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../helpers/notification.service';
import { EmailService } from '../../services/email.service';
import { LoadingService } from '../../helpers/loading.service';

@Component({
  selector: 'app-register-issue',
  templateUrl: './register-issue.page.html',
  styleUrls: ['./register-issue.page.scss'],
})
export class RegisterIssuePage {
  registroForm: FormGroup;
  photos: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private cameraService: CameraService,
    private http: HttpClient,
    private emaiService: EmailService,
    private authService: AuthService,
    private toastController: NotificationService,
    private loadingService: LoadingService
  ) {
    this.registroForm = this.formBuilder.group({
      CT_Titulo_Incidencia: ['', Validators.required],
      CT_Descripcion_Incidencia: ['', Validators.required],
      CT_Lugar_Incidencia: ['', Validators.required],
    });
  }
  async reset() {
    this.registroForm.reset();
    this.photos = [];
  }

  async onSubmit() {
    if (this.registroForm.valid) {
      const formValues = this.registroForm.value;
      const url_incident = 'https://ing-software-q0bk.onrender.com/api/incidents';
      const url_image = 'https://ing-software-q0bk.onrender.com/api/images';
      try {
        // Obtener el token del servicio de autenticación
        const token = await this.authService.getAccessToken();
        if (token) {
          // Decodificar el token para obtener el ID del usuario
          const decodedToken = this.authService.decodeToken(token);
          const CN_ID_Usuario = decodedToken.CN_ID_Usuario;
          // Agregar el ID del usuario a los datos del formulario
          formValues.CN_ID_Usuario = CN_ID_Usuario;
          formValues.CN_ID_Estado_Incidencia = 1; // Estado inicial de la incidencia
          // Enviar la solicitud con los datos del formulario
          const response: any = await this.http.post(url_incident, formValues).toPromise();

          for (const photo of this.photos) {
            const matches = photo.match(/^data:(image\/(\w+));base64,(.+)$/);
            if (matches && matches.length === 4) {
              const CT_Descripcion = matches[1]; // Tipo de imagen completo (por ejemplo, "image/jpeg")
              const CT_Tipo = matches[2]; // Formato de la imagen (por ejemplo, "jpeg")
              // Almacenamos los componentes de la imagen en el array separado
              await this.http.post(url_image, { CN_ID_Incidente: response.data.CN_ID_Incidente, CN_ID_Usuario: CN_ID_Usuario, CT_Descripcion: CT_Descripcion, CT_Tipo: CT_Tipo, CN_Datos: photo }).toPromise();
            } else {
              console.error("La cadena de datos de la imagen no tiene el formato esperado.");
            }
          }
          await this.loadingService.presentLoading('Cargando...');
          this.emaiService.sendEmail('josuehernandezarauz@gmail.com', 'Incidencia registrada', 'Se ha registrado una nueva incidencia en el sistema.')
            .subscribe(
              (response) => {
                this.toastController.presentToast('Incidencia registrada correctamente.', 'success');
                this.reset();
              },
              (error) => {
                this.toastController.presentToast('ERROR: No se pudo enviar el correo electrónico de notificación.', 'warning');
              }
            );


        } else {
          this.toastController.presentToast('ERROR: Usuario NO autenticado.', 'warning');
        }
      } catch (error) {
        this.toastController.presentToast('ERROR: No se pudo registrar la incidencia.', 'warning');

      }
    } else {
      this.toastController.presentToast('ERROR: Formulario incompleto, por favor, completa todos los campos requeridos', 'warning');
      Object.keys(this.registroForm.controls).forEach(field => {
        const control = this.registroForm.get(field);
        control?.markAsTouched({ onlySelf: true });
        control?.markAsDirty({ onlySelf: true });
      });
    }
    await this.loadingService.dismissLoading();
  }

  async tomarFoto() {
    try {
      const photo = await this.cameraService.tomarFoto();
      this.photos.push(photo);
    } catch (error) {
      this.toastController.presentToast('ERROR: No se pudo tomar la foto.', 'warning');}
  }

  async subirFotos() {
    try {
      const photo = await this.cameraService.subirFoto();
      if (!photo) {
        console.error('No se seleccionó ninguna foto.');
        return;
      }
      this.photos.push(photo);
    } catch (error) {
      this.toastController.presentToast('ERROR: No se pudo subir la foto.', 'warning');
    }
  }

  eliminarFoto(index: number) {
    if (index >= 0 && index < this.photos.length) {
      this.photos.splice(index, 1);
      this.toastController.presentToast('Foto eliminada correctamente.', 'success');
    } else {
      console.error('Índice de foto fuera de rango:', index);
    }
  }

}
