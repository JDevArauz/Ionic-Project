import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.page.html',
  styleUrls: ['./administrator.page.scss'],
})
export class AdministratorPage implements OnInit {
  userName: string = '';

  constructor(private router: Router, private user: UserService) { }

  ngOnInit() {
    this.user.getUser().then(user => {
      this.userName = user.CT_Nombre;
    });
  }

 reporteView(){
    this.router.navigate(['/reports-view']);
  }
}
