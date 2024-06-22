import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'https://ing-software-q0bk.onrender.com/api/send-email'; // URL del endpoint en tu backend

  constructor(private http: HttpClient) { }

  sendEmail(to: string, subject: string, text: string) {
    return this.http.post(this.apiUrl, { to, subject, text });
  }
}
