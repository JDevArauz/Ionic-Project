import { Component, OnInit, Input } from '@angular/core';
import { tick } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.scss'],
})
export class ImageModalComponent implements OnInit {
  @Input() photos: any[] | undefined;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
