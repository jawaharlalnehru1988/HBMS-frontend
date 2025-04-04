import { DatePipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BedData } from '../../shared/interceptors/typescript';
import { ApiService } from '../../shared/services/api.service';
import { map } from 'rxjs';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-patients',
  imports: [MatButtonModule,MatSortModule, DatePipe, NgIf, MatTableModule, MatIcon, MatPaginatorModule, MatDialogContent],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.scss'
})
export class PatientsComponent {
  readonly dialog = inject(MatDialog);
  displayedColumns: string[] = ['patientId', 'patientName', 'age', 'gender', 'admissionDate', 'actions'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
 constructor(private apiService: ApiService){}

ngOnInit():void{
  this.getAllPatientsData();
}

addData(): void {
    this.dialog.open(DialogUpdateDialog, {
      width: '350px',
      data: { value: "Add", ele: {}}
    }).afterClosed().subscribe(result => {
    console.log('result :', result);
    this.getAllPatientsData();
   
    });
  }
    getAllPatientsData(): void {
      this.apiService.getAllPatientDatas().subscribe({
        next: (res) => {
        console.log('getAllBedData response:', res);
        this.dataSource.data = res;
        },
        error: (err) => {
        console.error('getAllBedData error:', err);
        alert('Failed to fetch bed data!');
        }
      });
    }

      openEditDialog(ele: BedData): void {
        this.dialog.open(DialogUpdateDialog, {
          width: '350px',
          data: { value: "Edit", ele}
        }).afterClosed().subscribe(result => {
          this.getAllPatientsData();        });
      }

    openDeleteDialog(ele: string): void {
        this.dialog.open(DialogUpdateDialog, {
          width: '350px',
          data: { value: "Delete", ele}
        }).afterClosed().subscribe(result => {
          this.getAllPatientsData();
        });
      }
}



@Component({
  selector: 'dialog-update-dialog',
  templateUrl: 'dialog-update-dialog.html',
  styles: `
  mat-form-field {
    width: 100%;
  }
  `,
  imports: [MatButtonModule, MatFormFieldModule, MatSelectModule, ReactiveFormsModule, MatInputModule, FormsModule,  MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogUpdateDialog {
  PatientGroupForm!: FormGroup;
  readonly dialogRef = inject(MatDialogRef<DialogUpdateDialog>);
  readonly data = inject<any>(MAT_DIALOG_DATA);

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.PatientGroupForm = this.fb.group({
      _id: ['', Validators.required],
      patientName: ['', Validators.required],
      age: ['', Validators.required],
      gender: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.data.value === "Edit") {
      this.PatientGroupForm.patchValue(this.data.ele);
    } else if (this.data.value === "Delete") {
      this.PatientGroupForm.patchValue(this.data.ele._Id);
    } else{
      this.PatientGroupForm.reset();
    }
  }

  submitPatientData(){
    if (this.data.value === "Edit") {
      console.log('Update Patient Data:', this.PatientGroupForm.value);
      this.apiService.updatePatientData(this.PatientGroupForm.value).subscribe({
        next: (res) => {
          console.log('Update response:', res);
          alert('Patient data updated successfully!');
          this.dialogRef.close();
        },
        error: (err) => {
          console.error('Update error:', err);
          alert('Failed to update Patient data!');
        }
      });

    } else if (this.data.value === "Add") {
      this.apiService.addPatientData(this.PatientGroupForm.value).subscribe({
        next: (res) => {
          alert('Paient data added successfully!');
          this.dialogRef.close();
        },
        error: (err) => {
          alert('Failed to add Patient data!');
        }
      });
    } 
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  deleteBed(ele: string): void {
    this.apiService.deletePatientData(ele).subscribe({
      next:()=>{
        alert('Patient data deleted successfully!');
      },
      error: (err) => {
        alert('Failed to delete Patient data!');
      }
    });
  }
}