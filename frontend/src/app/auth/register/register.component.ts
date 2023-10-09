import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', '../../app.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      age: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      repeat_password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit(): void {
    console.log(this.registerForm.value);
    if (this.registerForm.valid) {
      const { username, first_name, last_name, age, email, password, repeat_password } = this.registerForm.value;
      console.log(username, first_name, last_name, age, email, password, repeat_password);

      this.http.post('http://localhost:3000/users/register', { username, first_name, last_name, age, email, password }, { withCredentials: true })
        .subscribe({
          next: (response) => {
            console.log('Registration successful:', response);
          },
          error: (error) => {
            console.error('Registration failed:', error);
          },
          complete: () => {
            this.registerForm.reset();
          }
        });
    }
  }
}
