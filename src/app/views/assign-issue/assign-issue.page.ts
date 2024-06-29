import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from '../../helpers/loading.service';
import { NotificationService } from '../../helpers/notification.service';
import { LogsService } from 'src/app/services/logs.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-assign-issue',
  templateUrl: './assign-issue.page.html',
  styleUrls: ['./assign-issue.page.scss'],
})
export class AssignIssuePage implements OnInit {
  // Definición de variables
  api: any = this.authService.getApiUrl();
  incidentForm: FormGroup;
  incidencia: any;
  tecnicos: any[] = []; // Aquí almacenaremos los técnicos disponibles
  afectaciones: any[] = []; // Aquí almacenaremos las afectaciones disponibles
  riesgos: any[] = []; // Aquí almacenaremos los riesgos disponibles
  prioridades: any[] = []; // Aquí almacenaremos las prioridades disponibles
  categorias: any[] = []; // Aquí almacenaremos las categorías disponibles

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private loadingService: LoadingService,
    private logsService: LogsService,
    private notificationService: NotificationService,
    private navCtrl: NavController,
  ) {
    // Inicialización del formulario con validaciones
    this.incidentForm = this.fb.group({
      titulo: ['', Validators.required],
      tecnico: ['', Validators.required],
      afectacion: ['', Validators.required],
      riesgo: ['', Validators.required],
      prioridad: ['', Validators.required],
      categoria: ['', Validators.required],
    });
  }

  ngOnInit() {
    // Verificamos si hay una incidencia en el estado del historial
    if (history.state && history.state.incidencia) {
      this.incidencia = history.state.incidencia;
      // Cargar los datos necesarios para el formulario
      this.loadTecnicos();
      this.loadAfectaciones();
      this.loadRiesgos();
      this.loadPrioridades();
      this.loadCategorias();
      // Prellenar el formulario con los datos de la incidencia
      this.prefillForm(this.incidencia);
    } else {
      console.error('No se pudo encontrar la incidencia en el estado de la historia.');
    }
  }

  // Método para cargar técnicos disponibles
  loadTecnicos() {
    this.authService.getAccessToken().then((token) => {
      this.http.get<any[]>(`${this.api}/asignations/tecnicos`).subscribe(
        (data) => {
          this.tecnicos = data;
          console.log('Técnicos recuperados', data);
        },
        (error) => {
          console.error('Error al recuperar técnicos', error);
        }
      );
    });
  }

  // Método para cargar afectaciones disponibles
  loadAfectaciones() {
    this.authService.getAccessToken().then((token) => {
      this.http.get<any[]>(`${this.api}/afectations`).subscribe(
        (data) => {
          this.afectaciones = data;
          console.log('Afectaciones recuperadas', data);
        },
        (error) => {
          console.error('Error al recuperar afectaciones', error);
        }
      );
    });
  }

  // Método para cargar riesgos disponibles
  loadRiesgos() {
    this.authService.getAccessToken().then((token) => {
      this.http.get<any[]>(`${this.api}/risks`).subscribe(
        (data) => {
          this.riesgos = data;
          console.log('Riesgos recuperados', data);
        },
        (error) => {
          console.error('Error al recuperar riesgos', error);
        }
      );
    });
  }

  // Método para cargar prioridades disponibles
  loadPrioridades() {
    this.authService.getAccessToken().then((token) => {
      this.http.get<any[]>(`${this.api}/priorities`).subscribe(
        (data) => {
          this.prioridades = data;
          console.log('Prioridades recuperadas', data);
        },
        (error) => {
          console.error('Error al recuperar prioridades', error);
        }
      );
    });
  }

  // Método para cargar categorías disponibles
  loadCategorias() {
    this.authService.getAccessToken().then((token) => {
      this.http.get<any[]>(`${this.api}/categories`).subscribe(
        (data) => {
          this.categorias = data;
          console.log('Categorías recuperadas', data);
        },
        (error) => {
          console.error('Error al recuperar categorías', error);
        }
      );
    });
  }

  // Método para prellenar el formulario con los datos de la incidencia
  prefillForm(incidencia: any) {
    this.incidentForm.patchValue({
      titulo: incidencia.CT_Titulo_Incidencia,
      afectacion: incidencia.T_Afectacion?.CT_Descripcion || '',
      riesgo: incidencia.T_Riesgo?.CT_Descripcion || '',
      prioridad: incidencia.T_Prioridad?.CT_Descripcion || '',
      categoria: incidencia.T_Categoria?.CT_Descripcion || ''
    });
  }

  // Método que se ejecuta al enviar el formulario
  onSubmit() {
    if (this.incidentForm.valid) {
      const formData = {
        CN_ID_Usuario: this.incidentForm.value.tecnico,
        CN_ID_Incidente: this.incidencia.CN_ID_Incidente,
        CN_ID_Afectacion: this.incidentForm.value.afectacion,
        CN_ID_Riesgo: this.incidentForm.value.riesgo,
        CN_ID_Prioridad: this.incidentForm.value.prioridad,
        CN_ID_Categoria: this.incidentForm.value.categoria
      };
      // Obtener el token de acceso y realizar la solicitud para asignar la incidencia
      this.authService.getAccessToken().then((token) => {
        this.http.post<any>(`${this.api}/asignations`, formData).subscribe(
          (data) => {
            console.log('Incidencia asignada', data);
            this.notificationService.presentToast('Incidencia asignada correctamente', 'success');
          },
          (error) => {
            console.error('Error al asignar incidencia', error);
            this.notificationService.presentToast('Error al asignar incidencia', 'danger');
          }
        );

        const dataUpdate = {
          CN_ID_Estado_Incidencia: 2,
          CN_ID_Afectacion_Incidencia: this.incidentForm.value.afectacion,
          CN_ID_Riesgo_Incidencia: this.incidentForm.value.riesgo,
          CN_ID_Prioridad_Incidencia: this.incidentForm.value.prioridad,
          CN_ID_Categoria_Incidencia: this.incidentForm.value.categoria
        };

        // Realizar la solicitud para actualizar el estado de la incidencia
        this.http.put<any>(`${this.api}/incidents/${this.incidencia.CN_ID_Incidente}`, dataUpdate).subscribe(
          async (data) => {
            const user = await this.authService.getUserFromToken();
            console.log('Incidencia actualizada', data);
            this.logsService.saveGeneralLog({
              CN_ID_Usuario: formData.CN_ID_Usuario,
              CN_ID_Pantalla: 3,
              CN_ID_Sistema: 1,
              CT_Referencia: "ASIGNACION DE INCIDENCIA:" + this.incidencia.CT_Titulo_Incidencia + "-TECNICO:" + user.CT_Nombre
            }).then((response) => {
              const dataLog = {
                CN_ID_Usuario: user.CN_ID_Usuario,
                CN_ID_Incidente: this.incidencia.CN_ID_Incidente,
                CN_Estado_Actual: 1,
                CN_Nuevo_Estado: 2,
                // Añadir más datos necesarios para el registro de log
              };
              // Enviar registro de log
              this.http.post(`${this.api}/logsE`, dataLog).subscribe(
                (data) => {
                  const dataLog = {
                    CN_ID_Usuario: user.CN_ID_Usuario,
                    CN_ID_Incidente: this.incidencia.CN_ID_Incidente,
                    CN_Estado_Actual: 2,
                    CN_Nuevo_Estado: 3,
                    // Añadir más datos necesarios para el registro de log
                  };

                  // Enviar registro de log
                  this.http.post(`${this.api}/logsE`, dataLog).subscribe(
                    (data) => {
                      this.http.put(`${this.api}/incidents/${this.incidencia.CN_ID_Incidente}`, { CN_ID_Estado_Incidencia: 3 }).subscribe(
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

            },
            (error) => {
              console.error('Error al guardar log', error);
            });
            this.notificationService.presentToast('Incidencia asignada correctamente', 'success');
            this.navCtrl.back();
          },
          (error) => {
            console.error('Error al actualizar la incidencia', error);
            this.notificationService.presentToast('Error al actualizar la incidencia', 'danger');
          }
        );
      });
    } else {
      this.notificationService.presentToast('Por favor complete todos los campos requeridos', 'danger');
    }
  }
}
