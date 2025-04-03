import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BedData } from '../../shared/interceptors/typescript';
import { ApiService } from '../../shared/services/api.service';
import { map } from 'rxjs';


@Component({
  selector: 'app-add-data',
  imports: [MatButtonModule, NgIf, MatTableModule, MatIcon, MatPaginatorModule, MatDialogContent],
  templateUrl: './add-data.component.html',
  styleUrl: './add-data.component.scss'
})
export class AddDataComponent {
  readonly dialog = inject(MatDialog);
  displayedColumns: string[] = ['bedId', 'bedNumber',  'ward', 'bedType', 'status', 'actions'];
  dataSource = new MatTableDataSource<BedData>();

  data: BedData[] = [
    { bedId: 1, bedNumber: '101', ward: 'ICU', bedType: 'A', status: 'Available' },
    { bedId: 2, bedNumber: '102', ward: 'General', bedType: 'B', status: 'Occupied' },
    { bedId: 3, bedNumber: '103', ward: 'ICU', bedType: 'C', status: 'Available' },
    { bedId: 4, bedNumber: '104', ward: 'General', bedType: 'A', status: 'Occupied' },
    { bedId: 5, bedNumber: '105', ward: 'ICU', bedType: 'C', status: 'Available' },
  ];
  constructor(private apiService: ApiService) {
    this.dataSource = new MatTableDataSource(this.data);
  }
  ngOnInit(): void {
    // this.dataSource = new MatTableDataSource(this.data);
    this.getAllBedData();
  }

  openEditDialog(ele: BedData): void {
    this.dialog.open(DialogAnimationsExampleDialog, {
      width: '350px',
      data: { value: "Edit", ele}
    }).afterClosed().subscribe(result => {
    console.log('result :', result);

    });
  }
  addData(): void {
    this.dialog.open(DialogAnimationsExampleDialog, {
      width: '350px',
      data: { value: "Add", ele: {}}
    }).afterClosed().subscribe(result => {
    console.log('result :', result);
    this.getAllBedData();
   
    });
  }

  getAllBedData(): void {
    this.apiService.getAllBedData().pipe(
      map((res: any[]) => res.map(item => ({
      ...item,
      _id: item._id.slice(-5) // Extract the last 5 characters of the _id
      })))
    ).subscribe({
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
  openDeleteDialog(ele: string): void {
    this.dialog.open(DialogAnimationsExampleDialog, {
      width: '350px',
      data: { value: "Delete", ele}
    }).afterClosed().subscribe(result => {
      console.log('result :', result);
    });
  }

}


@Component({
  selector: 'dialog-animations-example-dialog',
  templateUrl: 'dialog-animations-example-dialog.html',
  styles: `
  mat-form-field {
    width: 100%;
  }
  `,
  imports: [MatButtonModule, MatFormFieldModule, MatSelectModule, ReactiveFormsModule, MatInputModule, FormsModule,  MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogAnimationsExampleDialog {
  BedGroupForm!: FormGroup;
  readonly dialogRef = inject(MatDialogRef<DialogAnimationsExampleDialog>);
  readonly data = inject<any>(MAT_DIALOG_DATA);

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.BedGroupForm = this.fb.group({
      bedId: ['', Validators.required],
      bedNumber: ['', Validators.required],
      bedType: ['', Validators.required],
      ward: ['', Validators.required],
      status: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    console.log('this.data.value :', this.data.value);
    if (this.data.value === "Edit") {
      this.BedGroupForm.patchValue(this.data.ele);
    } else if (this.data.value === "Delete") {
      this.BedGroupForm.patchValue(this.data.ele.bedId);
    } else{
      this.BedGroupForm.reset();
    }
  }
  submitBookData(){
    if (this.data.value === "Edit") {
      console.log('Update Bed Data:', this.BedGroupForm.value);
      this.apiService.updateBedData(this.BedGroupForm.value).subscribe({
        next: (res) => {
          console.log('Update response:', res);
          alert('Bed data updated successfully!');
          this.dialogRef.close();
        },
        error: (err) => {
          console.error('Update error:', err);
          alert('Failed to update bed data!');
        }
      });

    } else if (this.data.value === "Add") {
      // Call the add API here
      console.log('Add Bed Data:', this.BedGroupForm.value);
      this.apiService.addBedData(this.BedGroupForm.value).subscribe({
        next: (res) => {
          console.log('Add response:', res);
          alert('Bed data added successfully!');
          this.dialogRef.close();
        },
        error: (err) => {
          console.error('Add error:', err);
          alert('Failed to add bed data!');
        }
      });
    } else if (this.data.value === "Delete") {
      // Call the delete API here
      console.log('Delete Bed Data:', this.BedGroupForm.value);
      this.apiService.deleteBedData(this.BedGroupForm.value.bedId).subscribe({
        next: (res) => {
          console.log('Delete response:', res);
          alert('Bed data deleted successfully!');
          this.dialogRef.close();
        },
        error: (err) => {
          console.error('Delete error:', err);
          alert('Failed to delete bed data!');
        }
      });
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  deleteBed(ele: string): void {
    console.log('deleteBed :', ele);
  }

}