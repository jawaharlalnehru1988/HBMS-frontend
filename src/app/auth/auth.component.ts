import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { CookieService} from 'ngx-cookie-service';
import { ApiService } from '../../shared/services/api.service';
import { Router } from '@angular/router';
import { ICreateUser } from '../../shared/interceptors/typescript';
@Component({
  selector: 'app-auth',
  imports: [MatInputModule, MatSelectModule, MatToolbarModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  registerForm!: FormGroup;
  loginForm!: FormGroup;
  isLogin = true;
  roles:string[] = ['doctor', 'admin', 'staff'];
  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router, private cookies: CookieService) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });

    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      sessionStorage.setItem("myvalue", this.registerForm.value);
      this.apiService.registerUser(this.registerForm.value).subscribe({
        next:()=>{
            this.isLogin = !this.isLogin;
        }
      });
    }
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.apiService.loginUser(this.loginForm.value).subscribe({
        next:(res:ICreateUser)=>{
        sessionStorage.setItem('token', res.token);
        this.cookies.set("auth", res.token);
          this.router.navigate(['/dashboard']);
        }
      });
    }
  }

  
  toggleForm() {
    this.isLogin = !this.isLogin;
  }

}
