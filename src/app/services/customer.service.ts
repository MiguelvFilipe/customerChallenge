import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomerModel } from '../models/customer.model';
import { Observable,tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  constructor(private http: HttpClient) { }

  GetAllCustomers(): Observable<CustomerModel[]> {
    return this.http.get<CustomerModel[]>("https://620e9760ec8b2ee28326ae84.mockapi.io/api/1/users")
  }
}