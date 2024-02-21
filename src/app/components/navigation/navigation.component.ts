import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [MatListModule, RouterOutlet, RouterLink, MatIconModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {
  menuList = [
      {id: 0, name: 'Dashboard', path: '/dashboard', icon: 'dashboard'},
      {id: 1, name: 'Orders', path: '/orders', icon: 'list_alt'}
    ];
}
