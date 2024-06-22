import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-supervisor',
  templateUrl: './supervisor.page.html',
  styleUrls: ['./supervisor.page.scss'],
})
export class SupervisorPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  viewReports() {
    // Lógica para redirigir a la página de ver reportes
    this.router.navigate(['/reports-view']);
  }
}
