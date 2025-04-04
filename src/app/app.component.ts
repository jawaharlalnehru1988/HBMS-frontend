import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet, NavigationEnd } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { DatePipe, NgClass } from '@angular/common';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { ApiService } from '../shared/services/api.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgClass, MatToolbar, RouterLink, DatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [JwtHelperService, { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }],
})
export class AppComponent {
  showHeader = true;
  constructor(private router:Router, private jwtHelper: JwtHelperService, private apiService: ApiService, private cookies: CookieService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showHeader = event.url !== '/login';
      }
    })
    this.setupTokenExpirationAlert();
  }

ngOnInit(): void {
  this.setupTokenExpirationAlert();
}

  logout(){
    sessionStorage.clear();
    this.router.navigate(['/login'])
    this.cookies.delete('auth');
  }
  isActive(route:string){
    return this.router.url === route;
  }

  //  Method to get the expiration time of the JWT token
  getTokenExpiration(): Date | null {
    const token = this.apiService.getToken();
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      if (decodedToken && decodedToken.exp) {
        return new Date(decodedToken.exp * 1000); // Convert to milliseconds
      }
    }
    return null;
  }

  setupTokenExpirationAlert() {
    const expiration = this.getTokenExpiration();
    if (expiration) {
      const timeToAlert = expiration.getTime() - Date.now() - 10 * 60 * 1000; // 10 minutes before expiration
      if (timeToAlert > 0) {
        setTimeout(() => {
          alert('Your session will expire in 10 minutes. Please save your work or renew your session.');
        }, timeToAlert);
      }
    }
  }
}
