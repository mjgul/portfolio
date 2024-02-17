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
    this.word$ = this.getWordsWithDelay();

  }

  getWord(){
    if(this.currentPlatform === "Mobile"){
      this.currentPlatform = "Web";
    } else {
      this.currentPlatform = "Mobile"
    }
    console.log("CURRENT: ", this.currentPlatform);
  }

  getWordsWithDelay(): Observable<string> {
    return interval(3000).pipe(
      take(this.words.length), // Take each word once
      map(index => this.words[index]), // Map index to word
      repeat() // Repeat the sequence indefinitely
    );
  }
}
