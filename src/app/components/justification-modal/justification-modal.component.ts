import { ModalController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/helpers/notification.service';

@Component({
  selector: 'app-justification-modal',
  templateUrl: './justification-modal.component.html',
  styleUrls: ['./justification-modal.component.scss'],
})
export class JustificationModalComponent implements OnInit {

  @Input() incidencia: any;
  @Input() accion: any;

  justificacionForm: FormGroup;
  api: any;

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.justificacionForm = this.formBuilder.group({
      justificacion: [''],
    });
    this.api = this.authService.getApiUrl();
  }

  ngOnInit() {
    console.log('Incidencia recibida:', this.incidencia);
    this.incidencia = this.incidencia.T_Incidencium;
    console.log('Incidencia Generada:', this.incidencia);

    console.log('Acción recibida:', this.accion);
  }

  async aceptarCierre() {
    const justificacion = this.justificacionForm.get('justificacion')?.value;
    console.log('Justificación de cierre:', justificacion);

    // Lógica para aceptar o rechazar la incidencia
    if (!this.incidencia) {
      console.error('Incidencia no definida');
      return;
    }

    const usuario = await this.authService.getUserFromToken();
    const dataLog = {
      CN_ID_Usuario: usuario.CN_ID_Usuario,
      CN_ID_Incidente: this.incidencia.CN_ID_Incidente,
      CN_Estado_Actual: 6,
      CN_Nuevo_Estado: this.accion === 'aceptar' ? 7 : 8,
      // Añadir más datos necesarios para el registro de log
    };

    // Enviar registro de log
    this.http.post(`${this.api}/logsE`, dataLog).subscribe(
      (data) => {
        // Actualizar incidencia con justificación y nuevo estado
    const estado = this.accion === 'aceptar' ? 7 : 8;
    this.http.put(`${this.api}/incidents/${this.incidencia.CN_ID_Incidente}`, {CN_ID_Estado_Incidencia: estado, CT_Justificacion_Estado: justificacion}).subscribe(
      (data) => {
        this.notificationService.presentToast('Justificación enviada correctamente', 'success');
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



    // Cerrar el modal después de las operaciones
    await this.modalController.dismiss();
  }

  cerrarModal() {
    this.modalController.dismiss();
  }

}
