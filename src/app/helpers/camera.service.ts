import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, PermissionStatus } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  async tomarFoto(): Promise<string> {
    try {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Camera
        });

        if (!image.dataUrl) {
          throw new Error('No se pudo obtener la imagen');
        }

        return image.dataUrl;
    } catch (error) {
      console.error('Error al tomar la foto:', error);
      throw error;
    }
  }

  // Método para seleccionar una imagen de la galería en la plataforma web
  async subirFoto(): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (event: any) => {
        const file = event.target.files[0];
        if (!file) {
          reject(new Error('No se seleccionó ningún archivo.'));
          return;
        }
        const reader = new FileReader();
        reader.onload = (readerEvent: any) => {
          const base64String = readerEvent.target.result;
          resolve(base64String);
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsDataURL(file);
      };
      input.click();
    });
  }
}
