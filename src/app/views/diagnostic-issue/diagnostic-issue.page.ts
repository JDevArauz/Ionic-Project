import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LoadingService } from '../../helpers/loading.service';
import { NotificationService } from '../../helpers/notification.service';

@Component({
  selector: 'app-diagnostic-issue',
  templateUrl: './diagnostic-issue.page.html',
  styleUrls: ['./diagnostic-issue.page.scss'],
})
export class DiagnosticIssuePage implements OnInit {
  diagnosticForm: FormGroup;
  incidencia: any;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private loadingService: LoadingService,
    private notificationService: NotificationService
  ) {
    this.diagnosticForm = this.formBuilder.group({
    CT_Diagnostico: ['', Validators.required],
    CN_Requiere_Compra: ['', Validators.required],
    CN_Tiempo_Solucion_Estimado: [Number, Validators.required],
    CT_Costo_Estimado: ['', Validators.required],
    CT_Observaciones: ['', Validators.required],
  });}

  ngOnInit() {
    if (history.state && history.state.incidencia) {
      this.incidencia = history.state.incidencia;
    } else {
      console.error('No se pudo encontrar la incidencia en el estado de la historia.');
    }
  }

  async reset() {
    this.diagnosticForm.reset();
    this.incidencia = null;
  }

  async onSubmit() {
    // Verificar si this.diagnosticForm está definido y no es null
    if (this.diagnosticForm && this.diagnosticForm.valid) {
      try {
        const token = await this.authService.getAccessToken();
        if (token) {
          const decodedToken = await this.authService.decodeToken(token);
          const CN_ID_Usuario = decodedToken.CN_ID_Usuario;
          const formValues = this.diagnosticForm.value;
          formValues.CN_ID_Incidente = this.incidencia.CN_ID_Incidente;
          formValues.CN_ID_Usuario = CN_ID_Usuario;
          formValues.CN_ID_Estado_Incidencia = 3; // Estado de diagnóstico
          if (formValues.CN_Requiere_Compra === 0) {
            formValues.CN_Requiere_Compra = "No";
          }else{
            formValues.CN_Requiere_Compra = "Si";
          }
          await this.loadingService.presentLoading('Cargando...');
          const url_diagnostic = 'https://ing-software-q0bk.onrender.com/api/diagnostics';
          this.http.post(url_diagnostic, formValues).subscribe(
            (response: any) => {
              this.notificationService.presentToast('Diagnóstico enviado correctamente', 'success');
              this.reset();
              this.router.navigate(['/technician']);
            },
            (error: any) => {
              this.notificationService.presentToast('Error al enviar el diagnóstico', 'danger');
            }
          );
        } else {
          this.notificationService.presentToast('No se pudo obtener el token de acceso', 'danger');
        }
      } catch (error) {
        this.notificationService.presentToast('Error al enviar el diagnóstico', 'danger');
      }
    } else {
      this.notificationService.presentToast('Por favor, complete el formulario', 'warning');
      Object.keys(this.diagnosticForm.controls).forEach(field => {
        const control = this.diagnosticForm.get(field);
        control?.markAsTouched({ onlySelf: true });
        control?.markAsDirty({ onlySelf: true });
      });
    }
    this.loadingService.dismissLoading();
  }


  selectSi() {
    this.diagnosticForm.controls['CN_Requiere_Compra'].setValue(1);
  }

  selectNo() {
    this.diagnosticForm.controls['CN_Requiere_Compra'].setValue(0);
  }

  tomarFoto() {
    // Implementa la lógica para tomar una foto
    console.log('Tomar foto');
  }

  subirArchivos() {
    // Implementa la lógica para subir archivos
    console.log('Subir archivos');
  }
}
