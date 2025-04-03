import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import { Router, RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AddDataComponent } from "../add-data/add-data.component";

@Component({
  selector: 'app-dashboard',
  imports: [MatCardModule, MatChipsModule, AddDataComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
longText = `The Chihuahua`;
constructor(private router: Router, private cookies: CookieService) { }
ngOnInit():void{
  const token =   this.cookies.get('auth');
  console.log('token :', token);
}

}
