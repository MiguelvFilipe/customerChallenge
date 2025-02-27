import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CustomersListModel } from 'src/app/models/customer.model';
import { Subject, takeUntil } from 'rxjs';
import { getCustomerList, getLoadingState } from '../../store/selectors/customers.selectors';
import { CustomerService } from '../../services/customer.service';
import { loadAppData } from '../../store/actions/customers.actions';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit, OnDestroy {
  customerList: CustomersListModel = { customerList: [], Errormessage: '', loading: true }; 
  isLoading!: boolean;
  errorMessage: string | null = null;
  private unsubscribe$ = new Subject<void>();
  
  constructor(
    private store: Store,
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log(this.customerList);
 
    this.store.dispatch(loadAppData());

    this.store.select(getCustomerList)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(info => {
        this.customerList.customerList = info;
      });

    // Select loading state from store
    this.store.select(getLoadingState)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(isLoading => {
        this.isLoading = isLoading;
        this.customerList.loading = isLoading; // Update loading state
      });

    // Subscribe to loading and error states from CustomerService
    this.customerService.loading$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(isLoading => {
        this.isLoading = isLoading;
      });

    this.customerService.error$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(errorMessage => {
        this.errorMessage = errorMessage;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onCustomerClick(customerId: string): void {
    this.router.navigate(['/customer', customerId]);
  }
}