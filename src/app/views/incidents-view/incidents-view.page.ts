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
  searchForm: FormGroup;
  toast: any = false;
  incidencias: any[] = [];
  user: any;
  isUser: boolean = false;
  photos: any[] = [];

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
      if (this.user == 3 && history.state && history.state.toast) {
        this.loadIncidenciasGeneradas();
        console.log('asignar incidencias');
      }else if (this.user == 3) {
        this.loadAsignarIncidencias();
        console.log('incidencias generadas');
      }else if (this.user == 5){
        this.loadAprobarIncidencias();
        console.log('aprobar incidencias');
      }else{
        this.loadIncidencias();
        console.log('todas las incidencias');
      }
    });


  }

  setIsUser(role: number) {
    const rolesUser = [2, 4];
    this.isUser = rolesUser.includes(role);
  }

 loadIncidencias() {
    this.authService.getAccessToken().then((token) => {
      this.http.get<any[]>('https://ing-software-q0bk.onrender.com/api/incidents').subscribe(
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
        .get<any[]>(`https://ing-software-q0bk.onrender.com/api/incidents/${token.CN_ID_Usuario}`)
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
        .get<any[]>(`https://ing-software-q0bk.onrender.com/api/incidents/noassign`)
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
      this.http
        .get<any[]>(`https://ing-software-q0bk.onrender.com/api/incidents/assigned/${token.CN_ID_Usuario}`)
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

  loadAprobarIncidencias() {
    this.http
      .get<any[]>(`https://ing-software-q0bk.onrender.com/api/incidents/ended`)
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
      .get<any[]>(`https://ing-software-q0bk.onrender.com/api/images/${incidenciaId}`)
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
          `https://ing-software-q0bk.onrender.com/api/incidents/search?CN_ID_Incidente=${searchValue}&CN_ID_Usuario=${searchValue}`
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
        `https://ing-software-q0bk.onrender.com/api/incidents/filter?CN_ID_Estado_Incidencia=${filterData.estado}&CN_ID_Prioridad_Incidencia=${filterData.prioridad}`
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
