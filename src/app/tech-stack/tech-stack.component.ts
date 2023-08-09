
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-tech-stack',
  templateUrl: './tech-stack.component.html',
  styleUrls: ['./tech-stack.component.scss'],
  standalone:true,
  imports:[CommonModule, IonicModule, FormsModule],
})
export class TechStackComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
