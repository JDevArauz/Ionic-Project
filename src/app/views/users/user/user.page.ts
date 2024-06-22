import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  toast: any = true;

  constructor(private router: Router, private toastController: ToastController) {}

  navigateToRegisterIssue() {
    this.router.navigate(['/register-issue']);
  }
  navigateToGeneratedIssues() {
    this.router.navigate(['/incidents-view'], { state: { toast: this.toast } });
  }

  ngOnInit() {
  }

}
