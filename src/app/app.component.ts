import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet, NavigationEnd } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { NgClass } from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgClass, MatToolbar, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  showHeader = true;
  constructor(private router:Router){
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showHeader = event.url !== '/login';
      }
    })
  }
  logout(){
    sessionStorage.clear();
    this.router.navigate(['/login'])
  }
  isActive(route:string){
    return this.router.url === route;
  }
}
