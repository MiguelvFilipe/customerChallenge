import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CustomersListModel, CustomerModel } from 'src/app/models/customer.model';
import { Subject, takeUntil } from 'rxjs';
import { getCustomerList, getLoadingState, getSelectedCustomer } from '../../store/selectors/customers.selectors';
import { CustomerService } from '../../services/customer.service';
import { loadAppData, searchCustomers, deleteCustomer, createCustomer, loadCustomerDetails, updateCustomer } from '../../store/actions/customers.actions';

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
  editCustomer: Partial<CustomerModel> | null = null;
  isInSearchMode: boolean = false;
  hasMoreData: boolean = true;

  // Add form validation properties
  formErrors = {
    newCustomer: {
      firstName: '',
      lastName: '',
      email: ''
    },
    editCustomer: {
      firstName: '',
      lastName: '',
      email: ''
    }
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
        this.noDataMessage = this.customerList.customerList.length === 0 ? 'No data' : null;
        this.hasMoreData = info.length >= this.limit;
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
      if (this.isInSearchMode) {
        this.performSearch();
      } else {
        this.loadCustomers();
      }
    }
  }

  onNextPage(): void {
    this.currentPage++;
    if (this.isInSearchMode) {
      this.performSearch();
    } else {
      this.loadCustomers();
    }
  }

  onLimitChange(newLimit: number): void {
    this.limit = parseInt(newLimit.toString());
    this.currentPage = 1;
    if (this.isInSearchMode) {
      this.onSearch();
    } else {
      this.customerService.invalidateCache();
      this.loadCustomers();
    }
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      if (!this.isInSearchMode) {
        this.currentPage = 1;
      }
      this.isInSearchMode = true;
      this.performSearch();
    } else {
      this.isInSearchMode = false;
      this.loadCustomers();
    }
  }

  performSearch(): void {
    this.store.dispatch(searchCustomers({ 
      query: this.searchQuery.trim(), 
      searchType: this.searchType,
      page: this.currentPage,
      limit: this.limit 
    }));
  }

  onShowHasContractChange(): void {
    this.store.select(getCustomerList)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(info => {
        this.customerList.customerList = this.filterByContract(info);
        this.noDataMessage = this.customerList.customerList.length === 0 ? 'No data' : null;
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

  validateForm(formType: 'new' | 'edit'): boolean {
    let isValid = true;
    const customer = formType === 'new' ? this.newCustomer : this.editCustomer;
    const errors = this.formErrors[formType === 'new' ? 'newCustomer' : 'editCustomer'];
    
    // Reset all error messages
    errors.firstName = '';
    errors.lastName = '';
    errors.email = '';
    
    // First name validation
    if (!customer?.firstName?.trim()) {
      errors.firstName = 'First name is required';
      isValid = false;
    }
    
    // Last name validation
    if (!customer?.lastName?.trim()) {
      errors.lastName = 'Last name is required';
      isValid = false;
    }
    
    // Email validation (if provided)
    if (customer?.email && customer.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customer.email)) {
        errors.email = 'Please enter a valid email address';
        isValid = false;
      }
    }
    
    return isValid;
  }

  onCreateCustomer(): void {
    if (this.validateForm('new')) {
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
    this.formErrors.newCustomer = { firstName: '', lastName: '', email: '' };
  }

  refreshData(): void {
    this.customerService.invalidateCache();
    this.loadCustomers();
  }

  onEditCustomer(customerId: string): void {
    this.store.dispatch(loadCustomerDetails({ customerId }));
    this.store.select(getSelectedCustomer)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(customer => {
        if (customer) {
          this.editCustomer = { ...customer };
        }
      });
  }

  onUpdateCustomer(): void {
    if (this.validateForm('edit')) {
      this.store.dispatch(updateCustomer({ customer: this.editCustomer! }));
      this.customerService.invalidateCache();
      this.loadCustomers();
      this.editCustomer = null;
    }
  }

  resetEditCustomerForm(): void {
    this.editCustomer = null;
    this.formErrors.editCustomer = { firstName: '', lastName: '', email: '' };
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.isInSearchMode = false;
    this.currentPage = 1;
    this.customerService.invalidateCache();
    this.loadCustomers();
  }
}