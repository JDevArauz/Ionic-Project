import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { JustificationModalComponent } from './justification-modal.component';

@NgModule({
  declarations: [JustificationModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ],
  exports: [JustificationModalComponent]
})
export class JustificationModalModule { }
