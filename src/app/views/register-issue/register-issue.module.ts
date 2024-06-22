import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RegisterIssuePageRoutingModule } from './register-issue-routing.module';
import { RegisterIssuePage } from './register-issue.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, // Asegúrate de que FormsModule esté importado aquí
    ReactiveFormsModule,
    IonicModule,
    RegisterIssuePageRoutingModule
  ],
  declarations: [RegisterIssuePage]
})
export class RegisterIssuePageModule {}
