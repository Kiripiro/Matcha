import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit(): void {
    const { email, password } = this.loginForm.value;
    console.log(email, password);
    console.log(this.loginForm.valid);
    if (this.loginForm.valid) {
      this.http.post('http://localhost:3000/users/login', { email, password }, { withCredentials: true })
        .subscribe({
          next: (response) => {
            console.log('Login successful:', response);
          },
          error: (error) => {
            console.error('Login failed:', error);
          },
          complete: () => {
            this.loginForm.reset();
          }
        });
    }
  }
}
