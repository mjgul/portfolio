import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Observable, of, interval } from 'rxjs';
import { map, take, repeat} from 'rxjs/operators';
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
  protected words: string[] = ['IOS', 'WEB', 'ANDROID'];

  word$: Observable<string> | undefined;

  constructor() { }

  ngOnInit() {
    

  }


}
