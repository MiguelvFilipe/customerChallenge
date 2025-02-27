import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { CustomerModel } from '../../models/customer.model';
import { Store } from '@ngrx/store';
import { getSelectedCustomer, getLoadingState, getErrorMessage } from '../../store/selectors/customers.selectors';
import { loadCustomerDetails } from '../../store/actions/customers.actions';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css']
})
export class CustomerDetailComponent implements OnInit, OnDestroy {
  customer: CustomerModel | null = null;
  errorMessage: string | null = null;
  isLoading: boolean = false;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private store: Store
  ) {}

  ngOnInit(): void {
    const customerId = this.route.snapshot.paramMap.get('id');
    if (customerId) {
      this.store.dispatch(loadCustomerDetails({ customerId }));
      this.store.select(getSelectedCustomer)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((customer: CustomerModel | null) => {
          if (customer) {
            this.customer = customer;
          } else {
            this.errorMessage = 'Customer not found';
          }
        });
      this.store.select(getLoadingState)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((isLoading: boolean) => {
          this.isLoading = isLoading;
        });
      this.store.select(getErrorMessage)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((errorMessage: string | null) => {
          this.errorMessage = errorMessage;
        });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}