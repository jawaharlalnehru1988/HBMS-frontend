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
      