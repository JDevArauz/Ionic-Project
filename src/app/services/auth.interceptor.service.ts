import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError, switchMap } from 'rxjs/operators';

// Define the AuthResponse interface
interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  /**
   * Intercepta todas las solicitudes HTTP para agregar el token de autorización si está disponible
   * y manejar la renovación del token automáticamente si es necesario.
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.authService.getAccessToken()).pipe(
      switchMap(token => {
        if (token) {
          // Si hay un token de acceso, se añade el encabezado de Autorización con Bearer token
          req = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
          });
        }

        // Continuar con la solicitud modificada
        return next.handle(req).pipe(
          catchError(error => {
            if (error.status === 401) {
              // Si la respuesta es 401 (No autorizado), intentar renovar el token
              return from(this.authService.getRefreshToken()).pipe(
                switchMap(refreshToken => {
                  if (refreshToken) {
                    // Llamar al método para renovar el token de acceso
                    return this.authService.refreshAccessToken(refreshToken).pipe(
                      switchMap((response: AuthResponse) => {
                        const newToken = response.accessToken;
                        // Actualizar los tokens en el servicio AuthService
                        return from(this.authService.setTokens(newToken, refreshToken)).pipe(
                          switchMap(() => {
                            // Reintentar la solicitud original con el nuevo token
                            req = req.clone({
                              headers: req.headers.set('Authorization', `Bearer ${newToken}`)
                            });
                            return next.handle(req);
                          })
                        );
                      }),
                      catchError(err => {
                        // Manejar el error de renovación del token
                        this.authService.logout(); // Cerrar sesión del usuario
                        return throwError(err); // Propagar el error
                      })
                    );
                  } else {
                    // No hay token de refresco disponible, cerrar sesión del usuario
                    this.authService.logout();
                    return throwError(error); // Propagar el error original
                  }
                })
              );
            } else {
              // Para otros errores, propagar el error
              return throwError(error);
            }
          })
        );
      })
    );
  }
}
