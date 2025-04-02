import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICreateUser, LoginDetail } from '../interceptors/typescript';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class  ApiService {

  constructor(private http: HttpClient, private cookies: CookieService) { }

  registerUser(regData: any){
    return this.http.post('http://localhost:4000/api/auth/register', regData);
  }

  loginUser(userData: LoginDetail){
    return this.http.post<ICreateUser>("http://localhost:4000/api/auth/login", userData);
  }

  getToken(){
     const token =   this.cookies.get('auth');
     console.log('token :', token);
     return token;
  }
  
  
}
