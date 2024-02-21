import { Component, EventEmitter, Input, Output, ViewChild, input } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SidenavComponent } from '../sidenav/sidenav.component';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [MatToolbarModule, MatIcon, MatButtonModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {
  title: string = "Sate.Slice";
  
  @Output()
  sidenavToggle: EventEmitter<boolean> = new EventEmitter();

  constructor(){
  }
  
  // toggleNotific() {
  //   this.notificPanel.toggle();
  // }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }
}
