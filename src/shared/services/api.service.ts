import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BedData, BookingData, ICreateUser, LoginDetail, PaginatedBeds } from '../interceptors/typescript';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class  ApiService {
  private authUrl = 'http://localhost:4000/api/auth/';
  private bedUrl = 'http://localhost:4000/api/beds/'; 
  private patientUrl = 'http://localhost:4000/api/patient/';
  private bookUrl = 'http://localhost:4000/api/booking/'

  constructor(private http: HttpClient, private cookies: CookieService) { }

  registerUser(regData: any){
    return this.http.post(`${this.authUrl}register`, regData);
  }

  loginUser(userData: LoginDetail){
    return this.http.post<ICreateUser>(`${this.authUrl}login`, userData);
  }

  getToken(){
     return this.cookies.get('auth');
  }
  
  addBedData(bedData: BedData){
    return this.http.post<BedData>(`${this.bedUrl}`, bedData);
  }
  getAllBedData(){
    return this.http.get<BedData[]>(`${this.bedUrl}`);
  }
  updateBedData(bedData: BedData){
  console.log('bedData :', bedData);
    return this.http.put<BedData>(`${this.bedUrl}${bedData._id}`, bedData);
  }
  deleteBedData(bedId: string){
    return this.http.delete<string>(`${this.bedUrl}${bedId}`);
  }
  
  addPatientData(patientData: any){
    return this.http.post<any>(`${this.patientUrl}admit`, patientData);
  }

  updatePatientData(patientData:any){
  console.log('patientData :', patientData);
    return this.http.put<any>(`${this.patientUrl}update/${patientData._id}`, patientData)
  }
  getAllPatientDatas(){
    return this.http.get<any>(`${this.patientUrl}`);
  }

  deletePatientData(userId:string){
    return this.http.delete<any>(`${this.patientUrl}delete/`+userId)
  }

  bookBed(data:BookingData){
    return this.http.post<BookingData>(`${this.bookUrl}book`, data);
  }
  getPaginatedBeds(page: number, limit: number):Observable<PaginatedBeds> {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('limit', limit.toString());

    return this.http.get<PaginatedBeds>(this.bedUrl+"page", { params });
  }

}
