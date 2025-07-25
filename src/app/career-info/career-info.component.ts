import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-career-info',
  templateUrl: './career-info.component.html',
  styleUrls: ['./career-info.component.scss'],
  standalone:true,
  imports:[IonicModule,CommonModule]
})
export class CareerInfoComponent  implements OnInit {
  @Input() project: any; // Data is passed in here
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    console.log(this.project);
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
