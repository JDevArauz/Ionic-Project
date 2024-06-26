import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
})
export class FilterModalComponent implements OnInit {
  api: any = this.authService.getApiUrl();
  filterForm: FormGroup;
  estados: any[] = [];
  prioridades: any[] = [];

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private http: HttpClient,
    private authService: AuthService,
  ) {
    this.filterForm = this.fb.group({
      estado: [null],
      prioridad: [null]
    });
  }

  ngOnInit() {
    this.loadEstados();
    this.loadPrioridades();
  }

  async loadEstados() {
    try {
      this.http.get<any[]>(`${this.api}/states`).subscribe(response => {
        this.estados = response;
      });
    } catch (error) {
      console.error('Error fetching estados', error);
    }
  }

  async loadPrioridades() {
    try {
      this.http.get<any[]>(`${this.api}/priorities`).subscribe(response => {
        this.prioridades = response;
      });
    } catch (error) {
      console.error('Error fetching prioridades', error);
    }
  }

  applyFilter() {
    this.modalCtrl.dismiss(this.filterForm.value);
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }
}
