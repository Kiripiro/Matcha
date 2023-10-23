import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../services/auth.service';
import { SocketioService } from 'src/services/socketio.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', '../../app.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private socketService: SocketioService
  ) {

  }

  ngOnInit(): void {
    if (this.authService.checkLog()) {
      if (this.authService.checkCompleteRegister()) {
        this.router.navigate(['']);
      } else {
        this.router.navigate(['auth/completeRegister']);
      }
    }
    this.registerForm = this.fb.group({
      username: ['cgangaro', Validators.required],
      first_name: ['Camille', Validators.required],
      last_name: ['Gangarossa', Validators.required],
      age: [24, Validators.required],
      email: ['cgangaro42@protonmail.com', [Validators.required, Validators.email]],
      password: ['qqqqqqqq', [Validators.required, Validators.minLength(8)]],
      repeat_password: ['qqqqqqqq', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { username, first_name, last_name, age, email, password, repeat_password } = this.registerForm.value;
      console.log(username, first_name, last_name, age, email, password, repeat_password);
      this.authService.register(username, first_name, last_name, age, email, password);
    }
  }
}
