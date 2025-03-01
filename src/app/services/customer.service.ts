import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomerModel } from '../models/customer.model';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, tap, finalize } from 'rxjs/operators';
  

/**
 * Customer Service
 * 
 * This service handles all customer-related operations including:
 * - Fetching, creating, updating and deleting customers
 * - Caching data 
 * - loading and error state handling
 */
@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private customerListCache: CustomerModel[] | null = null;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  private cache: { [key: string]: CustomerModel[] } = {};
  
  //loading and error state that components can subscribe to
  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();
  
  constructor(private http: HttpClient) { }
  
  // Fetches all customers from the API
  GetAllCustomers(page: number, limit: number): Observable<CustomerModel[]> {
    // Create a unique cache key based on pagination parameters
    const cacheKey = `${page}-${limit}`;
    // Return cached data if available
    if (this.cache[cacheKey]) {
      return of(this.cache[cacheKey]);
    }
  
    // Set loading state to true and clear any previous errors
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
  
    return this.http.get<CustomerModel[]>(`https://620e9760ec8b2ee28326ae84.mockapi.io/api/1/users?page=${page}&limit=${limit}`).pipe(
      // Cache the response data
      tap(data => this.cache[cacheKey] = data),
      // Handle any errors during the request
      catchError(error => {
        this.errorSubject.next('Failed to load customer data');
        return of([]);
      }),
      // Reset loading state when request completes (success or error)
      finalize(() => this.loadingSubject.next(false))
    );
  }

  // Fetches customer by ID
  GetCustomerById(customerId: string): Observable<CustomerModel | null> {
    return this.http.get<CustomerModel>(`https://620e9760ec8b2ee28326ae84.mockapi.io/api/1/users/${customerId}`).pipe(
      catchError(error => {
        this.errorSubject.next('Failed to load customer details');
        return of(null);
      })
    );
  }

  //Searches customers by first or last name
  SearchCustomers(query: string, searchType: 'firstName' | 'lastName', page: number, limit: number): Observable<CustomerModel[]> {
    // Create a unique cache key based on search parameters
    const cacheKey = `${searchType}-${query}-${page}-${limit}`;
    if (this.cache[cacheKey]) {
      return of(this.cache[cacheKey]);
    }

    // Set loading state to true and clear any previous errors
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.get<CustomerModel[]>(`https://620e9760ec8b2ee28326ae84.mockapi.io/api/1/users?${searchType}=${query}&page=${page}&limit=${limit}`).pipe(
      // Cache the response data
      tap(data => this.cache[cacheKey] = data),
      catchError(error => {
        this.errorSubject.next('Failed to search customers');
        return of([]);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  //Deletes a customer by ID
  DeleteCustomer(customerId: string): Observable<void> {
    return this.http.delete<void>(`https://620e9760ec8b2ee28326ae84.mockapi.io/api/1/users/${customerId}`).pipe(
      catchError(error => {
        this.errorSubject.next('Failed to delete customer');
        return of();
      })
    );
  }

  //Creates a new customer
  CreateCustomer(customer: Partial<CustomerModel>): Observable<CustomerModel> {
    return this.http.post<CustomerModel>('https://620e9760ec8b2ee28326ae84.mockapi.io/api/1/users', customer).pipe(
      catchError(error => {
        this.errorSubject.next('Failed to create customer');
        return of({} as CustomerModel);
      })
    );
  }

  //Updatess an existing customer
  UpdateCustomer(customer: Partial<CustomerModel>): Observable<CustomerModel> {
    return this.http.put<CustomerModel>(`https://620e9760ec8b2ee28326ae84.mockapi.io/api/1/users/${customer.id}`, customer).pipe(
      // Clear the cache when a customer is updated to ensure fresh data
      tap(() => this.invalidateCache()),
      catchError(error => {
        this.errorSubject.next('Failed to update customer');
        return of({} as CustomerModel); 
      })
    );
  }

  //Clean cache
  invalidateCache(): void {
    this.cache = {};
  }
}