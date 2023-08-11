import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss'],
  standalone:true,
  imports:[IonicModule,CommonModule]
})
export class ContactInfoComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
