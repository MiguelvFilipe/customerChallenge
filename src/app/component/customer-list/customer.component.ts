import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CustomersListModel, CustomerModel } from 'src/app/models/customer.model';
import { Subject, takeUntil } from 'rxjs';
import { getCustomerList, getLoadingState } from '../../store/selectors/customers.selectors';
import { CustomerService } from '../../services/customer.service';
import { loadAppData, searchCustomers, deleteCustomer, createCustomer } from '../../store/actions/customers.actions';

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
  searchQuery: string = '';
  searchType: 'firstName' | 'lastName' = 'firstName';
  showHasContract: boolean = false;
  noDataMessage: string | null = null;
  newCustomer: Partial<CustomerModel> = {
    firstName: '',
    lastName: '',
    birthDate: '',
    email: '',
    avatar: '',
    hasContract: false
  };
  
  constructor(
    private store: Store,
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCustomers();

    this.store.select(getCustomerList)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(info => {
        this.customerList.customerList = this.filterByContract(info);
        this.noDataMessage = this.customerList.customerList.length === 0 ? 'No data for hasContract = false' : null;
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

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.store.dispatch(searchCustomers({ query: this.searchQuery.trim(), searchType: this.searchType }));
    } else {
      this.loadCustomers();
    }
  }

  onShowHasContractChange(): void {
    this.store.select(getCustomerList)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(info => {
        this.customerList.customerList = this.filterByContract(info);
        this.noDataMessage = this.customerList.customerList.length === 0 ? 'No data for hasContract = false' : null;
      });
  }

  filterByContract(customerList: CustomerModel[]): CustomerModel[] {
    if (this.showHasContract) {
      return customerList.filter(customer => customer.hasContract);
    }
    return customerList;
  }

  isBirthdayThisMonth(birthDate: string): boolean {
    const currentMonth = new Date().getMonth();
    const customerBirthMonth = new Date(birthDate).getMonth();
    return currentMonth === customerBirthMonth;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onCustomerClick(customerId: string): void {
    this.router.navigate(['/customer', customerId]);
  }

  onDeleteCustomer(customerId: string): void {
    this.store.dispatch(deleteCustomer({ customerId }));
  }

  onCreateCustomer(): void {
    if (this.newCustomer.firstName && this.newCustomer.lastName) {
      this.store.dispatch(createCustomer({ customer: this.newCustomer }));
      this.resetNewCustomerForm();
    }
  }

  resetNewCustomerForm(): void {
    this.newCustomer = {
      firstName: '',
      lastName: '',
      birthDate: '',
      email: '',
      avatar: '',
      hasContract: false
    };
  }

  refreshData(): void {
    this.customerService.invalidateCache();
    this.loadCustomers();
  }
}