import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { FilterModalComponent } from 'src/app/components/filter-modal/filter-modal.component';
import { AuthService } from '../../services/auth.service';
import { ImageModalComponent } from 'src/app/components/image-modal/image-modal.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-incidents-view',
  templateUrl: './incidents-view.page.html',
  styleUrls: ['./incidents-view.page.scss'],
})
export class IncidentsViewPage implements OnInit {
  api: any = this.authService.getApiUrl();
  searchForm: FormGroup;
  incidencias: any[] = [];
  user: any;
  isUser: boolean = false;
  photos: any[] = [];
  toast: any = 0;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private modalCtrl: ModalController,
    private authService: AuthService,
    private history: ActivatedRoute
  ) {
    this.searchForm = this.formBuilder.group({
      buscar: [''],
    });
  }

  ngOnInit() {
    this.authService.getUserFromToken().then((token) => {
      if (token) {
        this.user = token.CN_ID_Rol;
        this.setIsUser(token.CN_ID_Rol);
      }
      this.toast = history.state.toast;
      console.log('user', this.user);
      console.log('toast', history.state.toast);

      if (this.user === 4 && history.state.toast === 0) {
        this.loadIncidenciasGeneradas();
        console.log('asignar incidencias');
      }else if (this.user === 4 && history.state.toast === 1) {
        this.loadIncidenciasAsignadas();
        console.log('incidencias generadas');
      }else if (this.user === 5 && history.state.toast === 1){
        this.loadAprobarIncidencias();
        console.log('aprobar incidencias');
      }else if (this.user === 3 && history.state.toast === 2) {
        this.loadAsignarIncidencias();
        console.log('aprobar incidencias');
      }else if (this.user === 3 && history.state.toast === 0) {
        this.loadIncidenciasGeneradas();
        console.log('incidencias generadas');
      }else if (this.user === 2 || this.user === 5 && history.state.toast === 0){
        this.loadIncidenciasGeneradas();
        console.log('generadas');
      }else{
        this.loadIncidencias();
      }
    });


  }

  setIsUser(role: number) {
    const rolesUser = [2, 3];
    this.isUser = rolesUser.includes(role);
  }

 loadIncidencias() {
    this.authService.getAccessToken().then((token) => {
      this.http.get<any[]>(`${this.api}/incidents`).subscribe(
        (data) => {
          this.incidencias = data;
        },
        (error) => {
          console.error('Error al recuperar incidentes', error);
        }
      );
    });
  }

  loadIncidenciasGeneradas() {
    this.authService.getUserFromToken().then((token) => {
      this.http
        .get<any[]>(`${this.api}/incidents/${token.CN_ID_Usuario}`)
        .subscribe(
          (data) => {
            this.incidencias = data;
          },
          (error) => {
            console.error('Error al recuperar incidentes generados', error);
          }
        );
    });
  }

  loadAsignarIncidencias() {
    this.authService.getUserFromToken().then((token) => {
      this.http
        .get<any[]>(`${this.api}/incidents/noassign`)
        .subscribe(
          (data) => {
            this.incidencias = data;
          },
          (error) => {
            console.error('Error al recuperar incidentes asignados', error);
          }
        );
    });
  }

  loadIncidenciasAsignadas() {
    this.authService.getUserFromToken().then((token) => {
      this.http.get<any[]>(`${this.api}/asignations/${token.CN_ID_Usuario}`)
        .subscribe(
          (data) => {
            // Aquí recibes las incidencias desde la API
            this.prepareIncidencias(data); // Llama a una función para preparar las incidencias
            console.log('Incidencias asignadas', data);
          },
          (error) => {
            console.error('Error al recuperar incidentes asignados', error);
          }
        );
    });
  }

  prepareIncidencias(data: any[]) {
    // Suponiendo que `data` es un arreglo de objetos como el que mostraste
    this.incidencias = data.map(item => {
      return {
        CN_ID_Asignacion: item.dataValues.CN_ID_Asignacion,
      CN_ID_Usuario: item.dataValues.CN_ID_Usuario,
      CN_ID_Incidente: item.dataValues.CN_ID_Incidente,
      CF_Fecha_Asignacion: item.dataValues.CF_Fecha_Asignacion,
      CF_Fecha_Hora_Registro: item.incidencia[0].CF_Fecha_Hora_Registro,
      CT_Titulo_Incidencia: item.incidencia[0].CT_Titulo_Incidencia,
      CT_Descripcion_Incidencia: item.incidencia[0].CT_Descripcion_Incidencia,
      CT_Lugar_Incidencia: item.incidencia[0].CT_Lugar_Incidencia,
      CN_ID_Estado_Incidencia: item.incidencia[0].CN_ID_Estado_Incidencia,
      CT_Justificacion_Estado: item.incidencia[0].CT_Justificacion_Estado,
      CN_ID_Prioridad_Incidencia: item.incidencia[0].CN_ID_Prioridad_Incidencia,
      CN_ID_Riesgo_Incidencia: item.incidencia[0].CN_ID_Riesgo_Incidencia,
      CN_ID_Afectacion_Incidencia: item.incidencia[0].CN_ID_Afectacion_Incidencia,
      CN_ID_Categoria_Incidencia: item.incidencia[0].CN_ID_Categoria_Incidencia,
      CD_Costos_Incidencia: item.incidencia[0].CD_Costos_Incidencia,
      CN_Duracion_Gestion_Incidencia: item.incidencia[0].CN_Duracion_Gestion_Incidencia,
      T_Estado: item.incidencia[0].T_Estado,
      T_Prioridad: item.incidencia[0].T_Prioridad,
      T_Riesgo: item.incidencia[0].T_Riesgo,
      T_Afectacion: item.incidencia[0].T_Afectacion,
      T_Categoria: item.incidencia[0].T_Categoria
      };
    });
    console.log('Incidencias preparadas', this.incidencias);
  }


  loadAprobarIncidencias() {
    this.http
      .get<any[]>(`${this.api}/incidents/ended`)
      .subscribe(
        (data) => {
          this.incidencias = data;
        },
        (error) => {
          console.error('Error al recuperar incidentes por aprobar', error);
        }
      );
  }


  loadImagesForIncidencias(incidenciaId: number) {
    this.photos = [];
    this.http
      .get<any[]>(`${this.api}/images/${incidenciaId}`)
      .subscribe(
        (data: any[]) => {
          if (data && data.length > 0) {
            // Verificar si ya existe un arreglo de fotos para esta incidenciaId
            data.forEach((imageData) => {
              const data = imageData.CN_Datos;
              const binary = new Uint8Array(data.data).reduce((acc, byte) => acc + String.fromCharCode(byte), '');
              this.photos.push(binary);
            });
          }
        },
        (error) => {
          console.error('Error al obtener imágenes para la incidencia', error);
        }
      );
  }


  async openFilterModal() {
    const modal = await this.modalCtrl.create({
      component: FilterModalComponent,
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.applyFilter(result.data);
      }
    });

    return await modal.present();
  }

  async onSearch() {
    const searchValue = this.searchForm.get('buscar')?.value;
    if (searchValue) {
      this.http
        .get<any[]>(
          `${this.api}/incidents/search?CN_ID_Incidente=${searchValue}&CN_ID_Usuario=${searchValue}`
        )
        .subscribe(
          (data) => {
            this.incidencias = data;
          },
          (error) => {
            console.error('Error al buscar incidentes', error);
          }
        );
    } else {
      this.loadIncidencias();
    }
  }

  async applyFilter(filterData?: any) {
    this.http
      .get<any[]>(
        `${this.api}/incidents/filter?CN_ID_Estado_Incidencia=${filterData.estado}&CN_ID_Prioridad_Incidencia=${filterData.prioridad}`
      )
      .subscribe(
        (data) => {
          this.incidencias = data;
        },
        (error) => {
          console.error('Error al filtrar incidentes', error);
        }
      );
  }

  async verEvidencias(incidencia: any) {
    // Cargar las imágenes correspondientes a la incidencia seleccionada
    await this.loadImagesForIncidencias(incidencia.CN_ID_Incidente);
    // Abrir el modal con las imágenes cargadas
    const modal = await this.modalCtrl.create({
      component: ImageModalComponent,
      componentProps: {
        photos: this.photos
      },
    });

    return await modal.present();
  }

  asignarIncidencia(incidencia: any) {
    this.router.navigate(['/assign-issue'], {
      state: { incidencia: incidencia },
    });
  }

  onEdit(incidencia: any) {
    this.router.navigate(['/diagnostic-issue'], {
      state: { incidencia: incidencia },
    });
  }
}
