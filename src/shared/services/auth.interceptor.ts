import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { ApiService } from './api.service';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private apiService: ApiService) { }
intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  const token = this.apiService.getToken();
  if (token) {
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + token)
      });
      return next.handle(clonedReq);
      }
      return next.handle(req);
}
}

