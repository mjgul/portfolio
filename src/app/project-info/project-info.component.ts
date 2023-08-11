import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.scss'],
  standalone:true,
  imports:[IonicModule,CommonModule]
})
export class ProjectInfoComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}
}
