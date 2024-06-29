import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  private api: string;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.api = this.authService.getApiUrl();
  }

  saveGeneralLog(data: any) {
    const now: Date = new Date();
    const formattedDateTime: string = this.formatDate(now);

    console.log(data); // Asegúrate de que `data` tenga los datos que esperas enviar

    return this.http.post(`${this.api}/logsG`, { CN_ID_Bitacora_General: formattedDateTime, ...data }).toPromise();
  }

  saveStateLog(data: any) {
    return this.http.post(`${this.api}/logsE`, { ...data }).toPromise();
  }

  private formatDate(date: Date): string {
    return date.getFullYear().toString() +
           this.padNumber(date.getMonth() + 1) +
           this.padNumber(date.getDate()) +
           this.padNumber(date.getHours()) +
           this.padNumber(date.getMinutes()) +
           this.padNumber(date.getSeconds());
  }

  padNumber(number: number): string {
    return number < 10 ? '0' + number : number.toString();
  }
}
