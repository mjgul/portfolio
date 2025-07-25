import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Component,OnInit, AfterViewInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss'],
  standalone:true,
  imports:[IonicModule,CommonModule]
})
export class ContactInfoComponent  implements OnInit {
  @ViewChild('canvasContainer') canvasContainer!: ElementRef;

  @Input() projects: any[] = []; // Pass project data from the parent
  @Output() projectClick = new EventEmitter<any>(); // Emit an event when a project is clicked


  constructor() {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  ngAfterViewInit(): void {
    console.log(this.projects);
  }



}
