import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  loading: HTMLIonLoadingElement | null = null;

  constructor(public loadingController: LoadingController) {}

  async presentLoading(message: string = 'Cargando...') {
    this.loading = await this.loadingController.create({
      message: message,
      spinner: 'circles' // Puedes cambiar el tipo de spinner aquí
    });
    await this.loading.present();
  }

  async dismissLoading() {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }
}
