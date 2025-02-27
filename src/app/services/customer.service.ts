import { HttpClient } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { CustomerModel } from '../models/customer.model';
  import { Observable, of, BehaviorSubject } from 'rxjs';
  import { catchError, tap, finalize } from 'rxjs/operators';
  
  @Injectable({
    providedIn: 'root'
  })
  export class CustomerService {
    private customerListCache: CustomerModel[] | null = null;
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private errorSubject = new BehaviorSubject<string | null>(null);
    private cache: { [key: string]: CustomerModel[] } = {};
  
    loading$ = this.loadingSubject.asObservable();
    error$ = this.errorSubject.asObservable();
  
    constructor(private http: HttpClient) { }
  
    GetAllCustomers(page: number, limit: number): Observable<CustomerModel[]> {
      const cacheKey = `${page}-${limit}`;
      if (this.cache[cacheKey]) {
        return of(this.cache[cacheKey]);
      }
  
      this.loadingSubject.next(true);
      this.errorSubject.next(null);
  
      return this.http.get<CustomerModel[]>(`https://620e9760ec8b2ee28326ae84.mockapi.io/api/1/users?page=${page}&limit=${limit}`).pipe(
        tap(data => this.cache[cacheKey] = data),
        catchError(error => {
          this.errorSubject.next('Failed to load customer data');
          return of([]);
        }),
        finalize(() => this.loadingSubject.next(false))
      );
    }

    GetCustomerById(customerId: string): Observable<CustomerModel | null> {
        return this.http.get<CustomerModel>(`https://620e9760ec8b2ee28326ae84.mockapi.io/api/1/users/${customerId}`).pipe(
            catchError(error => {
                this.errorSubject.next('Failed to load customer details');
                return of(null);
            })
        );
    }

    SearchCustomers(query: string, searchType: 'firstName' | 'lastName'): Observable<CustomerModel[]> {
        const cacheKey = `${searchType}-${query}`;
        if (this.cache[cacheKey]) {
            return of(this.cache[cacheKey]);
        }

        this.loadingSubject.next(true);
        this.errorSubject.next(null);

        return this.http.get<CustomerModel[]>(`https://620e9760ec8b2ee28326ae84.mockapi.io/api/1/users?${searchType}=${query}`).pipe(
            tap(data => this.cache[cacheKey] = data),
            catchError(error => {
                this.errorSubject.next('Failed to search customers');
                return of([]);
            }),
            finalize(() => this.loadingSubject.next(false))
        );
    }

    DeleteCustomer(customerId: string): Observable<void> {
        return this.http.delete<void>(`https://620e9760ec8b2ee28326ae84.mockapi.io/api/1/users/${customerId}`).pipe(
            catchError(error => {
                this.errorSubject.next('Failed to delete customer');
                return of();
            })
        );
    }

    CreateCustomer(customer: Partial<CustomerModel>): Observable<CustomerModel> {
        return this.http.post<CustomerModel>('https://620e9760ec8b2ee28326ae84.mockapi.io/api/1/users', customer).pipe(
            catchError(error => {
                this.errorSubject.next('Failed to create customer');
                return of({} as CustomerModel); // Return an empty CustomerModel object
            })
        );
    }
  }