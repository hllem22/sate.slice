import { CurrencyPipe, DatePipe, DecimalPipe, LowerCasePipe, NgOptimizedImage } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from './user.service';
import { ReversePipe } from './reverse.pipe';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [NgOptimizedImage, FormsModule, ReactiveFormsModule, LowerCasePipe, DecimalPipe, DatePipe, CurrencyPipe, ReversePipe, MatSlideToggleModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  // carService = inject(UserService);
  display = '';
  num = 103.1234;
  birthday = new Date(2023, 3, 2);
  cost = 4560.34;
  word = 'You are a champion';

  username = 'Wally';
  logoUrl = '/assets/logo.svg';
  logoAlt = 'Angular logo';
  favoriteFramework = '';

  @Input() name = '';

  @Output() addItemEvent = new EventEmitter<string>();

  addItem() {
    this.addItemEvent.emit('🐢');
  }

  showFramework() {
    alert(this.favoriteFramework);
  }

  profileForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
  });

  handleSubmit() {
    alert(this.profileForm.value.name + ' | ' + this.profileForm.value.email);
  }

  constructor(private carService: UserService) {
    this.display = this.carService.getCars().join(' ⭐️ ');
  }
}