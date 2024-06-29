import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Storage } from '@ionic/storage-angular';

// Define la interfaz AuthResponse para tipar las respuestas de autenticación
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';  // URL base de la API
  private accessTokenKey = 'access_token';  // Clave de almacenamiento para el token de acceso
  private refreshTokenKey = 'refresh_token';  // Clave de almacenamiento para el token de actualización

  constructor(private http: HttpClient, private storage: Storage) {
    this.initStorage();  // Inicializa el almacenamiento al crear el servicio
  }

  /**
   * Inicializa el almacenamiento de Ionic Storage
   */
  private async initStorage() {
    await this.storage.create();
  }

  /**
   * Método para iniciar sesión
   * @param credentials Las credenciales del usuario (correo y contraseña)
   * @returns Un Observable con la respuesta de autenticación
   */
  login(credentials: { CT_Correo: string; CT_Contrasena: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(async (response: AuthResponse) => {
        if (response) {
          await this.setTokens(response.accessToken, response.refreshToken);  // Guarda los tokens obtenidos
        }
      }),
      catchError(this.handleError)  // Maneja cualquier error que ocurra
    );
  }

  /**
   * Método para almacenar los tokens de acceso y de actualización
   * @param accessToken El token de acceso
   * @param refreshToken El token de actualización
   */
  public async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    await this.storage.set(this.accessTokenKey, accessToken);
    await this.storage.set(this.refreshTokenKey, refreshToken);
  }

  /**
   * Método para obtener el token de acceso almacenado
   * @returns El token de acceso o null si no está almacenado
   */
  async getAccessToken(): Promise<string | null> {
    return await this.storage.get(this.accessTokenKey);
  }

  /**
   * Método para obtener la URL de la API
   * @returns La URL base de la API
   */
  getApiUrl() {
    return this.apiUrl;
  }

  /**
   * Método para obtener el token de actualización almacenado
   * @returns El token de actualización o null si no está almacenado
   */
  async getRefreshToken(): Promise<string | null> {
    return await this.storage.get(this.refreshTokenKey);
  }

  /**
   * Método para refrescar el token de acceso utilizando el token de actualización
   * @param refreshToken El token de actualización
   * @returns Un Observable con la nueva respuesta de autenticación
   */
  refreshAccessToken(refreshToken: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/token`, { refreshToken }).pipe(
      tap(async (response: AuthResponse) => {
        if (response) {
          await this.setTokens(response.accessToken, refreshToken);  // Guarda los nuevos tokens obtenidos
        }
      }),
      catchError(this.handleError)  // Maneja cualquier error que ocurra
    );
  }

  /**
   * Método para cerrar sesión eliminando los tokens almacenados
   */
  async logout(): Promise<void> {
    await this.storage.remove(this.accessTokenKey);
    await this.storage.remove(this.refreshTokenKey);
  }

  /**
   * Método para obtener información del usuario a partir del token de acceso
   * @returns La información del usuario decodificada del token, o null si no hay un token válido
   */
  async getUserFromToken(): Promise<any> {
    const accessToken = await this.getAccessToken();
    if (accessToken) {
      const tokenParts = accessToken.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));  // Decodifica la parte del payload
        return payload;  // Retorna la información del usuario
      }
    }
    return null;  // Retorna null si no hay un token de acceso válido
  }

  /**
   * Método para decodificar un token JWT
   * @param token El token JWT a decodificar
   * @returns La información decodificada del token
   */
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

  /**
   * Maneja errores que ocurren durante la autenticación
   * @param error El error que ocurrió
   * @returns Un Observable que lanza un error
   */
  private handleError(error: any) {
    console.error('Error durante la autenticación:', error);
    return throwError('Ocurrió un problema con la autenticación');
  }
}
