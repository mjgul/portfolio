import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CareerInfoComponent } from '../career-info/career-info.component';
import { ContactInfoComponent } from '../contact-info/contact-info.component';
import { PersonalInfoComponent } from '../personal-info/personal-info.component';
import { ProjectInfoComponent } from '../project-info/project-info.component';
import { EducationInfoComponent } from '../education-info/education-info.component';
import { TechStackComponent } from '../tech-stack/tech-stack.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule,CareerInfoComponent,ContactInfoComponent,PersonalInfoComponent,ProjectInfoComponent, EducationInfoComponent, TechStackComponent],
})
export class HomePage {
  constructor() {}
}
