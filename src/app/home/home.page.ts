import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ThreeCanvasComponent } from 'src/app/components/three-canvas/three-canvas.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule,ThreeCanvasComponent],
})
export class HomePage {

  constructor() {}



}
