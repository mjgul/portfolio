import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
  standalone:true,
  imports:[CommonModule, IonicModule, FormsModule],
  changeDetection:ChangeDetectionStrategy.Default
})
export class PersonalInfoComponent  implements OnInit {
  protected platform:string[] = ["Mobile", "Web"];
  protected currentPlatform:string = "Mobile";
  constructor() { }

  ngOnInit() {
    setInterval(() => {
      this.getWord();
    }, 3000);

  }

  getWord(){
    if(this.currentPlatform === "Mobile"){
      this.currentPlatform = "Web";
    } else {
      this.currentPlatform = "Mobile"
    }
    console.log("CURRENT: ", this.currentPlatform);
  }
}
