import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private authService: AuthService) {
  }
  async getUser(): Promise<any> {
    const user = await this.authService.getUserFromToken();
    return user;
  }

}
