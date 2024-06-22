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

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.authService.getAccessToken()).pipe(
      switchMap(token => {
        if (token) {
          req = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
          });
        }

        return next.handle(req).pipe(
          catchError(error => {
            if (error.status === 401) {
              // Token expired, attempt to refresh
              return from(this.authService.getRefreshToken()).pipe(
                switchMap(refreshToken => {
                  if (refreshToken) {
                    return this.authService.refreshAccessToken(refreshToken).pipe(
                      switchMap((response: AuthResponse) => {
                        const newToken = response.accessToken;
                        return from(this.authService.setTokens(newToken, refreshToken)).pipe(
                          switchMap(() => {
                            req = req.clone({
                              headers: req.headers.set('Authorization', `Bearer ${newToken}`)
                            });
                            return next.handle(req);
                          })
                        );
                      }),
                      catchError(err => {
                        this.authService.logout();
                        return throwError(err);
                      })
                    );
                  } else {
                    this.authService.logout();
                    return throwError(error);
                  }
                })
              );
            } else {
              return throwError(error);
            }
          })
        );
      })
    );
  }
}
