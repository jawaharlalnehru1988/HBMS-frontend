import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: '', redirectTo: 'auth', pathMatch: 'full'},
    {path: 'auth', loadComponent: () => import('../app/auth/auth.component').then(c => c.AuthComponent)},
    {path: 'dashboard', loadComponent: () => import('../app/dashboard/dashboard.component').then(c => c.DashboardComponent)},
    {path: 'booking', loadComponent: () => import('../app/booking/booking.component').then(c => c.BookingComponent)},
    {path: 'patients', loadComponent: () => import('../app/patients/patients.component').then(c => c.PatientsComponent)},
    {path: 'beds', loadComponent: () => import('../app/beds/beds.component').then(c => c.BedsComponent)},
];
