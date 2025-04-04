import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable, startWith, map } from 'rxjs';
import { ApiService } from '../../shared/services/api.service';
import { BedData, BookingData, PatientData } from '../../shared/interceptors/typescript';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-booking',
  imports: [FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatButton,
    AsyncPipe,],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss'
})
export class BookingComponent {
  bookingFormGroup: FormGroup;
  patientOptions: PatientData[] = [];
  bedOptions: BedData[] = [];
  filteredPatientOptions!: Observable<PatientData[]>;
  filteredBedOptions!: Observable<BedData[]>;
  isBooking = true;

  constructor(private fb: FormBuilder, private apiService: ApiService){
    this.bookingFormGroup = this.fb.group({
      patient: ["", Validators.required],
      bed: ['', Validators.required]
    })
  }

  ngOnInit() {
    this.fetchPatientOptions();
    this.fetchBedOptions();

    this.filteredPatientOptions = this.bookingFormGroup.get('patient')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterPatients(value || ''))
    );

    this.filteredBedOptions = this.bookingFormGroup.get('bed')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterBeds(value || ''))
    );

  }

  private fetchPatientOptions() {
    this.apiService.getAllPatientDatas().subscribe({
      next:(data) => {
        this.patientOptions = data;
      }
    });
  }
  onBedInputFocus() {
    this.filteredBedOptions =  this.bookingFormGroup.get('bed')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterBeds(value || ''))
    );
  }
  onPatientInputFocus(){
    this.filteredPatientOptions = this.bookingFormGroup.get('patient')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterPatients(value || ''))
    );
  }
  displayPatientFn(user: PatientData): string {
    return user && user.patientName ? user.patientName : '';
  }

  displayBedFn(bed: BedData): string {
    return bed && bed.bedNumber ? bed.bedNumber : '';
  }


  private fetchBedOptions() {
    this.apiService.getAllBedData().subscribe(data => {
      this.bedOptions = data;
    });
  }

  private _filterPatients(value: string): PatientData[] {
    const filterValue = value.toLowerCase();
    return this.patientOptions.filter(option => option.patientName.toLowerCase().includes(filterValue));
  }

  private _filterBeds(value: string): BedData[] {
    const filterValue = value.toLowerCase();
    return this.bedOptions.filter(option => option.bedNumber.toLowerCase().includes(filterValue));
  }
 
  submitData(){
   if(this.bookingFormGroup.valid){
    const value = this.bookingFormGroup.value;
    console.log('value :', value);
    if (this.isBooking && value) {
      const bookingPayload:BookingData = {
        patientId: value.patient._id,
        bedId: value.bed._id,
        status: "Admitted",
        admissionDate: new Date()
      }

   this.postBookedValue(bookingPayload);
    } else {
      const disChargePayload:BookingData = {
        patientId: value.patient._id,
        bedId: value.bed._id,
        status: "Discharged",
        dischargeDate: new Date()
      }
      this.postBookedValue(disChargePayload);
    }
   }
  }

  postBookedValue(bookingPayload:BookingData){
    this.apiService.bookBed(bookingPayload).subscribe({
      next:(data:any)=>{
      console.log('data :', data);
      alert('completely successfully')
      },
      error:()=>{
      alert("Could not book")        
      }
    })
  }

  cancel(){


  }

}
