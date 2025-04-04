    export interface ICreateUser {
        token: string;
        message: string;
    }

    export interface LoginDetail{
        email:string;
        password:string;
    }

    export interface BedData {
        _id?: string;
        bedId: any;
        bedNumber: string;
        bedType: string;
        ward: string;
        status: string;
      }

      export interface PatientData {
        _id: string
        patientName: string
        age: string
        gender: string
        createdAt: string
        updatedAt: string
        __v: number
      }


      export interface BookingData {
        patientId: string
        bedId: string
        status: string
        admissionDate?: Date;
        dischargeDate?:Date;
      }

     export interface PaginatedBeds {
        beds: BedData[]; // Replace 'any' with your Bed interface
        currentPage: number;
        totalPages: number;
        totalItems: number;
      }
      
      