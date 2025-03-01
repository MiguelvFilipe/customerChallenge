import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CustomersListModel, CustomerModel } from 'src/app/models/customer.model';
import { Subject, takeUntil } from 'rxjs';
import { getCustomerList, getLoadingState, getSelectedCustomer } from '../../store/selectors/customers.selectors';
import { CustomerService } from '../../services/customer.service';
import { loadAppData, searchCustomers, deleteCustomer, createCustomer, loadCustomerDetails, updateCustomer } from '../../store/actions/customers.actions';
import { debounceTime } from 'rxjs/operators';

/**
 * Customer Component
 * 
 * This component handles the display and management of customers list:
 * - Listing customers with pagination
 * - Searching and filtering functionality
 * - Creating, updating, and deleting customers
 * - Viewing customer details
 */
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit, OnDestroy {
  customerList: CustomersListModel = { customerList: [], Errormessage: '', loading: true }; 
  noDataMessage: string | null = null;
  isLoading!: boolean;
  errorMessage: string | null = null;
  currentPage: number = 1;
  limit: number = 10;
  searchQuery: string = '';
  searchType: 'firstName' | 'lastName' = 'firstName';
  showHasContract: boolean = false;
  newCustomer: Partial<CustomerModel> = {
    firstName: '',
    lastName: '',
    birthDate: undefined,
    email: '',
    avatar: 'http://loremflickr.com/cache/resized/defaultImage.small_640_480_nofilter.jpg',
    hasContract: false
  };
  editCustomer: Partial<CustomerModel> | null = null;
  isInSearchMode: boolean = false;
  hasMoreData: boolean = true;
  customerToDeleteId: string | null = null;
  selectedCustomer: CustomerModel | null = null;
  selectedCustomerForDetails: CustomerModel | null = null;

  //Modal Visibility States
  isDetailsModalVisible = false;
  isVisible = false;
  isEditModalVisible = false;
  isDeleteModalVisible = false;

  //Forms Validation
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

  private unsubscribe$ = new Subject<void>();
  private searchSubject = new Subject<string>();
  private cachedCustomerList: CustomerModel[] = [];
  private cachedPage: number = 1;
  private cachedLimit: number = 10;

  constructor(
    private store: Store,
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCustomers();

    // Subscribe to customer list updates from the store
    this.store.select(getCustomerList)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(info => {
        this.customerList.customerList = this.filterByContract(info);
        
        if (!this.isInSearchMode) {
          this.cachedCustomerList = [...info];
          this.cachedPage = this.currentPage;
          this.cachedLimit = this.limit;
        }
        
        this.noDataMessage = this.customerList.customerList.length === 0 ? 'No data' : null;
        this.hasMoreData = info.length >= this.limit;
      });

    // Subscribe to loading state updates
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

    // Subscribe to error messages
    this.customerService.error$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(errorMessage => {
        this.errorMessage = errorMessage;
      });

    // Set up debounced search
    this.searchSubject.pipe(
      debounceTime(500),
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      this.onSearch();
    });
  }

  //clen subscriptions when the component is destroyed
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  //Loads customer data from the API
  loadCustomers(): void {
    this.store.dispatch(loadAppData({ page: this.currentPage, limit: this.limit }));
  }

  // Navigate to the previous and next page
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

  //Limit the number of items displayed on the page
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

  //refresh the data
  refreshData(): void {
    this.currentPage = 1;
    this.customerService.invalidateCache();
    this.loadCustomers();
  }

  // search operations
  onSearch(): void {
    if (this.searchQuery.trim()) {
      if (!this.isInSearchMode) {
        this.currentPage = 1;
      }
      this.isInSearchMode = true;
      this.performSearch();
    } else {
      this.clearSearch();
    }
  }

  //search for customers when the search input changes + debounce
  onSearchInputChange(): void {
    this.searchSubject.next(this.searchQuery);
  }

  //search for customers
  performSearch(): void {
    this.store.dispatch(searchCustomers({ 
      query: this.searchQuery.trim(), 
      searchType: this.searchType,
      page: this.currentPage,
      limit: this.limit 
    }));
  }

  //clear the search query
  clearSearch(): void {
    this.searchQuery = '';
    this.isInSearchMode = false;
    this.currentPage = 1;
    this.customerService.invalidateCache();
    this.loadCustomers();
  }

  //show customers with contracts
  onShowHasContractChange(): void {
    this.store.select(getCustomerList)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(info => {
        this.customerList.customerList = this.filterByContract(info);
        this.noDataMessage = this.customerList.customerList.length === 0 ? 'No data' : null;
      });
  }

  //filter customers with contracts
  filterByContract(customerList: CustomerModel[]): CustomerModel[] {
    if (this.showHasContract) {
      return customerList.filter(customer => customer.hasContract);
    }
    return customerList;
  }

  //Customer Detail Modal
  onCustomerClick(customerId: string): void {
    this.isEditModalVisible = false;
    this.editCustomer = null;
    
    this.store.dispatch(loadCustomerDetails({ customerId }));
    
    const subscription = this.store.select(getSelectedCustomer)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(customer => {
        if (customer) {
          this.selectedCustomerForDetails = { ...customer };
          this.isDetailsModalVisible = true;
          subscription.unsubscribe(); 
        }
      });
  }
  handleDetailsModalCancel(): void {
    this.isDetailsModalVisible = false;
    this.selectedCustomerForDetails = null;
  }


  //Customer Creation Modal
  showCreationModal(): void {
    this.isVisible = true;
  }

  onCreateCustomer(): void {
    if (this.validateForm('new')) {
      this.store.dispatch(createCustomer({ customer: this.newCustomer }));
      this.resetNewCustomerForm();
      this.isVisible = false;
    }
  }

  handleCreationCancel(): void {
    this.isVisible = false;
    this.resetNewCustomerForm();
  }

  resetNewCustomerForm(): void {
    this.newCustomer = {
      firstName: '',
      lastName: '',
      birthDate: undefined,
      email: '',
      avatar: '',
      hasContract: false
    };
    this.formErrors.newCustomer = { firstName: '', lastName: '', email: '' };
  }

  //Customer Edit Modal
  onEditCustomer(customerId: string): void {
    this.isDetailsModalVisible = false;
    this.selectedCustomerForDetails = null;
    
    this.store.dispatch(loadCustomerDetails({ customerId }));
  
    const subscription = this.store.select(getSelectedCustomer)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(customer => {
        if (customer) {
          this.editCustomer = { ...customer };
          this.isEditModalVisible = true;
          subscription.unsubscribe(); 
        }
      });
  }

  onUpdateCustomer(): void {
    if (this.validateForm('edit')) {
      this.store.dispatch(updateCustomer({ customer: this.editCustomer! }));
      this.customerService.invalidateCache();
      this.loadCustomers();
      this.isEditModalVisible = false;
      this.resetEditCustomerForm();
    }
  }

  handleEditCancel(): void {
    this.isEditModalVisible = false;
    this.resetEditCustomerForm();
  }

  resetEditCustomerForm(): void {
    this.editCustomer = null;
    this.formErrors.editCustomer = { firstName: '', lastName: '', email: '' };
  }

  //Customer Deletion Modal
  onDeleteCustomer(customerId: string): void {
    this.customerToDeleteId = customerId;
    this.isDeleteModalVisible = true;
  }
  confirmDelete(): void {
    if (this.customerToDeleteId) {
      this.store.dispatch(deleteCustomer({ customerId: this.customerToDeleteId }));
      this.isDeleteModalVisible = false;
      this.customerToDeleteId = null;
    }
  }
  handleDeleteCancel(): void {
    this.isDeleteModalVisible = false;
    this.customerToDeleteId = null;
  }

  //Form Validation
  validateForm(formType: 'new' | 'edit'): boolean {
    let isValid = true;
    const customer = formType === 'new' ? this.newCustomer : this.editCustomer;
    const errors = this.formErrors[formType === 'new' ? 'newCustomer' : 'editCustomer'];
  
    errors.firstName = '';
    errors.lastName = '';
    errors.email = '';
    
    // Validate first name
    if (!customer?.firstName?.trim()) {
      errors.firstName = 'First name is required';
      isValid = false;
    }
    
    // Validate last name
    if (!customer?.lastName?.trim()) {
      errors.lastName = 'Last name is required';
      isValid = false;
    }
    
    // Validate email format if provided
    if (customer?.email && customer.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customer.email)) {
        errors.email = 'Please enter a valid email address';
        isValid = false;
      }
    }
    
    return isValid;
  }


  onBirthDateChange(date: Date): void {
    this.newCustomer.birthDate = date ? date.toISOString() : undefined;
  }

  disableFutureDates = (current: Date): boolean => {
    return current > new Date();
  };

  formatBirthdate(birthDate: string | undefined): string {
    if (!birthDate) return 'N/A';
    const date = new Date(birthDate);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  //CHeck if the customer has a birthday this month
  isBirthdayThisMonth(birthDate: string): boolean {
    if (!birthDate) return false;
    const currentMonth = new Date().getMonth();
    const customerBirthMonth = new Date(birthDate).getMonth();
    return currentMonth === customerBirthMonth;
  }
  getBirthdateClass(birthDate: string | undefined): string {
    if (!birthDate) return '';
    return this.isBirthdayThisMonth(birthDate) ? 'highlight-birthday' : '';
  }
}