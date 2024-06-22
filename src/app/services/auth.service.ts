import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Storage } from '@ionic/storage-angular';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://ing-software-q0bk.onrender.com/api';
  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';

  constructor(private http: HttpClient, private storage: Storage) {
    this.initStorage();
  }

  private async initStorage() {
    await this.storage.create();
  }

  login(credentials: { CT_Correo: string; CT_Contrasena: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(async (response: AuthResponse) => {
        if (response) {
          await this.setTokens(response.accessToken, response.refreshToken);
        }
      }),
      catchError(this.handleError)
    );
  }

  public async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    await this.storage.set(this.accessTokenKey, accessToken);
    await this.storage.set(this.refreshTokenKey, refreshToken);
  }

  async getAccessToken(): Promise<string | null> {
    return await this.storage.get(this.accessTokenKey);
  }

  async getRefreshToken(): Promise<string | null> {
    return await this.storage.get(this.refreshTokenKey);
  }

  refreshAccessToken(refreshToken: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/token`, { refreshToken }).pipe(
      tap(async (response: AuthResponse) => {
        if (response) {
          await this.setTokens(response.accessToken, refreshToken);
        }
      }),
      catchError(this.handleError)
    );
  }

  async logout(): Promise<void> {
    await this.storage.remove(this.accessTokenKey);
    await this.storage.remove(this.refreshTokenKey);
  }

  async getUserFromToken(): Promise<any> {
    const accessToken = await this.getAccessToken();
    if (accessToken) {
      const tokenParts = accessToken.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1])); // Decodifica la parte del payload
        return payload; // Retorna la información del usuario
      }
    }
    return null; // Retorna null si no hay un token de acceso válido
  }

  // Método para decodificar el token JWT
  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = window.atob(payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      throw error;
    }
  }

  private handleError(error: any) {
    console.error('Error during authentication:', error);
    return throwError('Something went wrong with authentication');
  }
}
