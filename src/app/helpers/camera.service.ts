import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  /**
   * Método para tomar una foto utilizando la cámara del dispositivo.
   * @returns Una promesa que se resuelve con la URL de la imagen en base64.
   * @throws Error si no se pudo obtener la imagen.
   */
  async tomarFoto(): Promise<string> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,                // Calidad de la imagen
        allowEditing: false,        // Permitir edición de la imagen
        resultType: CameraResultType.DataUrl, // Tipo de resultado (Data URL)
        source: CameraSource.Camera // Fuente de la imagen (Cámara)
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

  /**
   * Método para seleccionar una imagen de la galería en la plataforma web.
   * @returns Una promesa que se resuelve con la URL de la imagen en base64, o undefined si no se seleccionó ningún archivo.
   * @throws Error si no se pudo seleccionar o leer la imagen.
   */
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
