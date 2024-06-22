import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.page.html',
  styleUrls: ['./administrator.page.scss'],
})
export class AdministratorPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
 reporteView(){
    this.router.navigate(['/reports-view']);
  }
}
