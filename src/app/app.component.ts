import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UserComponent } from './views/user/user.component';
import { CommentsComponent } from './views/comments/comments.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TopbarComponent } from './components/topbar/topbar.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, UserComponent, CommentsComponent, TopbarComponent, SidenavComponent, MatToolbarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Sate.Slice';
  // city = 'San Francisco';
  // isServerRunning = true;

  // users = [
  //   {id: 0, name: 'Sarah'},
  //   {id: 1, name: 'Amy'},
  //   {id: 2, name: 'Rachel'},
  //   {id: 3, name: 'Jessica'},
  //   {id: 4, name: 'Poornima'},
  // ];

  // isEditable = true;

  // message = '';

  // onMouseOver() {
  //   this.message = 'Way to go 🚀';
  // };
  
  // items = new Array();
  // key = 'eg';
  // addItem(item: string) {
  //   this.key = item
  //   this.items.push(item);
  // }
  
  // @Output() sidenavLayoutToggle = new EventEmitter<boolean>();
  // openMenu = false;
  // clickMenu() {
  //   this.openMenu = !this.openMenu;
  //   this.sidenavLayoutToggle.emit(this.openMenu);
  // }

}

