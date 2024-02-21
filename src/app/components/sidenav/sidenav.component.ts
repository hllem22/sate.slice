import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { SidenavService } from './sidenav.service';
import { TopbarComponent } from '../topbar/topbar.component';
import { MatButtonModule } from '@angular/material/button';
import { NavigationComponent } from '../navigation/navigation.component';
import { RouterOutlet } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [MatSidenavModule, TopbarComponent, MatButtonModule, NavigationComponent, RouterOutlet, NgOptimizedImage],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent implements OnInit {
  @ViewChild('sidenav') public sidenav: MatSidenav;
  @Input() sidenavLayout:any;
  showFiller = false;

  constructor(private sideNavService: SidenavService){

  }

  ngOnInit(): void {
    this.sideNavService.setSidenav(this.sidenav);
  }

  @Output() sidenavLayoutToggle = new EventEmitter<boolean>();
  openMenu = true;
  clickMenu() {
    this.openMenu = !this.openMenu;
    this.sidenavLayoutToggle.emit(this.openMenu);
  }
}
