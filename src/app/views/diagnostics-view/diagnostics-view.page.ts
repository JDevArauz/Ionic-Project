import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { ImageModalComponent } from 'src/app/components/image-modal/image-modal.component';

@Component({
  selector: 'app-diagnostics-view',
  templateUrl: './diagnostics-view.page.html',
  styleUrls: ['./diagnostics-view.page.scss'],
})
export class DiagnosticsViewPage implements OnInit {
  searchForm: FormGroup;
  incidencias: any[] = [];
  user: any;
  photos: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private modalCtrl: ModalController,
    private authService: AuthService
  ) {
    this.searchForm = this.formBuilder.group({
      buscar: [''],
    });
  }

  ngOnInit() {
      this.loadDiagnostics();
  }

  loadDiagnostics() {
    this.authService.getUserFromToken().then((token) => {
      this.http
        .get<any[]>(`https://ing-software-q0bk.onrender.com/api/diagnostics/${token.CN_ID_Usuario}`)
        .subscribe(
          (data) => {
            this.incidencias = data;
            console.log('Incidencias generadas', this.incidencias);

          },
          (error) => {
            console.error('Error al recuperar incidentes generados', error);
          }
        );
    });
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


  async onSearch() {
    const searchValue = this.searchForm.get('buscar')?.value;
    if (searchValue) {
      this.http
        .get<any[]>(
          `https://ing-software-q0bk.onrender.com/api/diagnostics/search?CN_ID_Incidente=${searchValue}&CN_ID_Usuario=${searchValue}`
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
      this.loadDiagnostics();
    }
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
}
