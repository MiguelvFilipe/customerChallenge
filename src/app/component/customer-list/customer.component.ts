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
  currentPage: number = 1;
  limit: number = 10;
  
  constructor(
    private store: Store,
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log(this.customerList);
 
    this.loadCustomers();

    this.store.select(getCustomerList)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(info => {
        this.customerList.customerList = info;
      });

    this.store.select(getLoadingState)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(isLoading => {
        this.isLoading = isLoading;
        this.customerList.loading = isLoading;
      });
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

  loadCustomers(): void {
    this.store.dispatch(loadAppData({ page: this.currentPage, limit: this.limit }));
  }

  onPrevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadCustomers();
    }
  }

  onNextPage(): void {
    this.currentPage++;
    this.loadCustomers();
  }

  onLimitChange(newLimit: number): void {
    this.limit = newLimit;
    this.loadCustomers();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onCustomerClick(customerId: string): void {
    this.router.navigate(['/customer', customerId]);
  }
}