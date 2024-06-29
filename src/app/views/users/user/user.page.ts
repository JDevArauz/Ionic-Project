import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  userName: any = "";

  constructor(private router: Router, private toastController: ToastController, private user: UserService) {}

  navigateToRegisterIssue() {
    this.router.navigate(['/register-issue']);
  }
  navigateToGeneratedIssues() {
    this.router.navigate(['/incidents-view'], { state: { toast: 0 } });
  }

  ngOnInit() {
    this.user.getUser().then(user => {
      this.userName = user.CT_Nombre;
  });
}

}
