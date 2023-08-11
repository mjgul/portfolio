import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-career-info',
  templateUrl: './career-info.component.html',
  styleUrls: ['./career-info.component.scss'],
  standalone:true,
  imports:[IonicModule,CommonModule]
})
export class CareerInfoComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
