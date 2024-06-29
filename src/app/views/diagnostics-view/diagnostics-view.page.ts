import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { ImageModalComponent } from 'src/app/components/image-modal/image-modal.component';
import { JustificationModalComponent } from 'src/app/components/justification-modal/justification-modal.component';

@Component({
  selector: 'app-diagnostics-view',
  templateUrl: './diagnostics-view.page.html',
  styleUrls: ['./diagnostics-view.page.scss'],
})
export class DiagnosticsViewPage implements OnInit {
  api: any = this.authService.getApiUrl(); // URL de la API obtenida del servicio de autenticación
  searchForm: FormGroup; // Formulario reactivo para la búsqueda
  incidencias: any[] = []; // Arreglo para almacenar las incidencias
  user: any; // Información del usuario actual
  photos: any[] = []; // Arreglo para almacenar fotos de incidencias
  toast: any; // Variable para mostrar mensajes toast

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private modalCtrl: ModalController,
    private authService: AuthService,
    private modalController: ModalController
  ) {
    // Inicialización del formulario reactivo con un campo de búsqueda
    this.searchForm = this.formBuilder.group({
      buscar: [''],
    });
  }

  ngOnInit() {
    // Verificar el estado del historial para mostrar un mensaje toast
    this.toast = history.state.toast;
    if (this.toast === 1) {
      this.loadAllDiagnostics(); // Cargar todas las incidencias
    } else {
      this.loadDiagnostics(); // Cargar incidencias específicas del usuario
    }
  }

  // Método para cargar todas las incidencias desde la API
  loadAllDiagnostics() {
    this.http
      .get<any[]>(`${this.api}/diagnostics`)
      .subscribe(
        (data) => {
          this.incidencias = data;
          console.log('Incidencias generadas', this.incidencias);
        },
        (error) => {
          console.error('Error al recuperar incidentes generados', error);
        }
      );
  }

  // Método para cargar incidencias específicas del usuario desde la API
  loadDiagnostics() {
    this.authService.getUserFromToken().then((token) => {
      this.http
        .get<any[]>(`${this.api}/diagnostics/${token.CN_ID_Usuario}`)
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

  // Método para cargar imágenes de una incidencia específica
  loadImagesForIncidencias(incidenciaId: number) {
    this.photos = [];
    this.http
      .get<any[]>(`${this.api}/images/${incidenciaId}`)
      .subscribe(
        (data: any[]) => {
          if (data && data.length > 0) {
            // Convertir los datos de la imagen en formato binario a cadena
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

  // Método para realizar una búsqueda de incidencias
  async onSearch() {
    const searchValue = this.searchForm.get('buscar')?.value;
    if (searchValue) {
      this.http
        .get<any[]>(
          `${this.api}/diagnostics/search?CN_ID_Incidente=${searchValue}&CN_ID_Usuario=${searchValue}`
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
      this.loadDiagnostics(); // Si no hay valor de búsqueda, cargar incidencias del usuario
    }
  }

  // Método para ver evidencias (imágenes) de una incidencia
  async verEvidencias(incidencia: any) {
    await this.loadImagesForIncidencias(incidencia.CN_ID_Incidente); // Cargar imágenes de la incidencia
    const modal = await this.modalCtrl.create({
      component: ImageModalComponent,
      componentProps: {
        photos: this.photos
      },
    });
    return await modal.present(); // Presentar el modal con las imágenes cargadas
  }

  // Método para abrir un modal con justificación de la incidencia
  async abrirModal(incidencia: any, accion: string) {
    const modal = await this.modalController.create({
      component: JustificationModalComponent,
      componentProps: {
        incidencia: incidencia,
        accion: accion
      }
    });
    await modal.present(); // Presentar el modal con la justificación
  }
}
