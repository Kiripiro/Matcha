import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../../app.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit(): void {
    const { username, password } = this.loginForm.value;
    console.log(username, password);
    console.log(this.loginForm.valid);
    if (this.loginForm.valid) {
      this.http.post('http://localhost:3000/users/login', { username, password }, { withCredentials: true })
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
