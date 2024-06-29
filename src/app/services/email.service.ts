import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  api: any = this.authService.getApiUrl();
  private apiUrl = `${this.api}/send-email`; // URL del endpoint en tu backend

  constructor(private http: HttpClient, private authService: AuthService) { }

  sendEmail(to: string, subject: string, text: string) {
    return this.http.post(this.apiUrl, { to, subject, text });
  }
}
