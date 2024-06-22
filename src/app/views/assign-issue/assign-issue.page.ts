import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from '../../helpers/loading.service';
import { NotificationService } from '../../helpers/notification.service';

@Component({
  selector: 'app-assign-issue',
  templateUrl: './assign-issue.page.html',
  styleUrls: ['./assign-issue.page.scss'],
})
export class AssignIssuePage implements OnInit {
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
    private notificationService: NotificationService
  ) {
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
    if (history.state && history.state.incidencia) {
      this.incidencia = history.state.incidencia;
      this.loadTecnicos();
      this.loadAfectaciones();
      this.loadRiesgos();
      this.loadPrioridades();
      this.loadCategorias();
      this.prefillForm(this.incidencia);
    } else {
      console.error('No se pudo encontrar la incidencia en el estado de la historia.');
    }

  }

  loadTecnicos() {
    this.authService.getAccessToken().then((token) => {
      this.http.get<any[]>('https://ing-software-q0bk.onrender.com/api/asignations/tecnicos').subscribe(
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

  loadAfectaciones() {
    this.authService.getAccessToken().then((token) => {
      this.http.get<any[]>('https://ing-software-q0bk.onrender.com/api/afectations').subscribe(
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

  loadRiesgos() {
    this.authService.getAccessToken().then((token) => {
      this.http.get<any[]>('https://ing-software-q0bk.onrender.com/api/risks').subscribe(
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

  loadPrioridades() {
    this.authService.getAccessToken().then((token) => {
      this.http.get<any[]>('https://ing-software-q0bk.onrender.com/api/priorities').subscribe(
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

  loadCategorias() {
    this.authService.getAccessToken().then((token) => {
      this.http.get<any[]>('https://ing-software-q0bk.onrender.com/api/categories').subscribe(
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

  prefillForm(incidencia: any) {
    this.incidentForm.patchValue({
      titulo: incidencia.CT_Titulo_Incidencia,
      afectacion: incidencia.T_Afectacion?.CT_Descripcion || '',
      riesgo: incidencia.T_Riesgo?.CT_Descripcion || '',
      prioridad: incidencia.T_Prioridad?.CT_Descripcion || '',
      categoria: incidencia.T_Categoria?.CT_Descripcion || ''
    });
  }

  onSubmit() {
    if (this.incidentForm.valid) {
      this.loadingService.presentLoading('Asignando incidencia...');
      const formData = {
        CN_ID_Usuario: this.incidentForm.value.tecnico,
        CN_ID_Incidente: this.incidencia.CN_ID_Incidente,
        CN_ID_Afectacion: this.incidentForm.value.afectacion,
        CN_ID_Riesgo: this.incidentForm.value.riesgo,
        CN_ID_Prioridad: this.incidentForm.value.prioridad,
        CN_ID_Categoria: this.incidentForm.value.categoria
      };
      this.authService.getAccessToken().then((token) => {
        this.http.post<any>('https://ing-software-q0bk.onrender.com/api/asignations', formData).subscribe(
          (data) => {
            console.log('Incidencia asignada', data);
            this.notificationService.presentToast('Incidencia asignada correctamente', 'success');
            this.router.navigate(['/incidents-view']);
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
        this.http.put<any>(`https://ing-software-q0bk.onrender.com/api/incidents/${this.incidencia.CN_ID_Incidente}`, {dataUpdate}).subscribe(
          (error) => {
            this.notificationService.presentToast('Error al actualizar incidencia', 'danger');
          }
        ).add(() => {
          this.loadingService.dismissLoading();
        });
      });
    }
  }
}
