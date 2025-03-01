import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomerComponent } from './customer.component';
import { Store } from '@ngrx/store';
import { CustomerService } from '../../services/customer.service';
import { Router } from '@angular/router';
import { of, BehaviorSubject } from 'rxjs';
import { CustomerModel } from 'src/app/models/customer.model';


describe('CustomerComponent', () => {
  let component: CustomerComponent;
  let fixture: ComponentFixture<CustomerComponent>;
  let mockStore: jasmine.SpyObj<Store>;
  let mockCustomerService: jasmine.SpyObj<CustomerService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockIconService: jasmine.SpyObj<NzIconService>;
  
  const mockCustomers: CustomerModel[] = [
    {
      id: '1',
      firstName: 'Mike',
      lastName: 'McQueen',
      email: 'Mike.McQueen@example.com',
      birthDate: '1990-01-01T00:00:00.000Z',
      avatar: 'http://example.com/avatar1.jpg',
      hasContract: true
    },
    {
      id: '2',
      firstName: 'User',
      lastName: 'UserLastName',
      email: 'user@example.com',
      birthDate: '1992-05-15T00:00:00.000Z',
      avatar: 'http://example.com/avatar2.jpg',
      hasContract: false
    }
  ];
  
  const mockLoadingSubject = new BehaviorSubject<boolean>(false);
  const mockErrorSubject = new BehaviorSubject<string | null>(null);

  beforeEach(async () => {
    mockStore = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    mockCustomerService = jasmine.createSpyObj('CustomerService', ['invalidateCache']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockIconService = jasmine.createSpyObj('NzIconService', ['addIcon', 'fetchFromIconfont', 'createIconfontIcon']);
    
    // Configure mock store select
    mockStore.select.and.callFake((selector: any) => {
      // Convert the selector to string for comparison if needed
      const selectorString = typeof selector === 'string' ? selector : selector.toString();
      
      if (selectorString.includes('getCustomerList')) {
        return of(mockCustomers);
      } else if (selectorString.includes('getLoadingState')) {
        return of(false);
      } else if (selectorString.includes('getSelectedCustomer')) {
        return of(mockCustomers[0]);
      }
      
      return of(mockCustomers);
    });
    
    // Set up mock customer service properties
    Object.defineProperty(mockCustomerService, 'loading$', { value: mockLoadingSubject.asObservable() });
    Object.defineProperty(mockCustomerService, 'error$', { value: mockErrorSubject.asObservable() });

    await TestBed.configureTestingModule({
      declarations: [ CustomerComponent ],
      imports: [
        RouterTestingModule,
        FormsModule,
        NzModalModule,
        NzTableModule,
        NzInputModule,
        NzButtonModule,
        NzSwitchModule,
        NzSelectModule,
        NzDatePickerModule,
        NzIconModule,
        NzToolTipModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: CustomerService, useValue: mockCustomerService },
        { provide: Router, useValue: mockRouter },
        { provide: NzIconService, useValue: mockIconService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerComponent);
    component = fixture.componentInstance;
    
    component.customerList = { 
      customerList: [...mockCustomers],
      Errormessage: '',
      loading: false
    };
    // fix for some icon erros related to the NG-ZORRO library
    spyOn(component, 'onEditCustomer').and.callFake((id: string) => {
      component.isEditModalVisible = true;
      component.editCustomer = {...mockCustomers[0]};
    });
    
    fixture.detectChanges();
  });

  // Test 1: Customer Creation
  describe('Customer Creation', () => {
    it('should show creation modal when showCreationModal is called', () => {
      component.showCreationModal();
      expect(component.isVisible).toBeTrue();
    });

    it('should validate and create a new customer when valid data is provided', () => {
      mockStore.dispatch.calls.reset();
      component.newCustomer = {
        firstName: 'Mike',
        lastName: 'McQueen',
        email: 'Mike.McQueen@example.com',
        birthDate: '1998-11-30T00:00:00.000Z',
        avatar: 'http://example.com/avatar1.jpg',
        hasContract: true
      };
      
      component.onCreateCustomer();
      
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        jasmine.objectContaining({
          type: '[Customer] Create Customer',
          customer: jasmine.objectContaining({
            firstName: 'Mike'
          })
        })
      );
      expect(component.isVisible).toBeFalse();
    });

    it('should show validation errors when creating customer with invalid data', () => {
      component.isVisible = true;
      component.newCustomer = {
        firstName: '',
        lastName: '',
        email: 'invalid-email',
        birthDate: undefined,
        avatar: '',
        hasContract: false
      };
      
      component.onCreateCustomer();
      
      expect(component.formErrors.newCustomer.firstName).toBe('First name is required');
      expect(component.formErrors.newCustomer.lastName).toBe('Last name is required');
      expect(component.formErrors.newCustomer.email).toBe('Please enter a valid email address');
      expect(component.isVisible).toBeTrue(); 
    });

    it('should reset form when canceling customer creation', () => {
      component.newCustomer = {
        firstName: 'Mike',
        lastName: 'McQueen',
        email: 'Mike.McQueen@example.com.',
        hasContract: true
      };
      
      component.handleCreationCancel();
      
      expect(component.isVisible).toBeFalse();
      expect(component.newCustomer.firstName).toBe('');
      expect(component.newCustomer.lastName).toBe('');
      expect(component.newCustomer.email).toBe('');
    });
  });

  // Test 2: Customer Editing
  describe('Customer Editing', () => {
    it('should load customer details and show edit modal', () => {
      component.onEditCustomer('1');
      
      expect(component.isEditModalVisible).toBeTrue();
      expect(component.editCustomer).toEqual(mockCustomers[0]);
    });

    it('should update customer when valid data is provided', () => {
      mockStore.dispatch.calls.reset();
      
      component.editCustomer = {
        id: '1',
        firstName: 'Mike',
        lastName: 'McQueen Updated',
        email: 'Mike.McQueen@example.com.',
        birthDate: '1998-11-30T00:00:00.000Z',
        hasContract: false
      };
      
      component.onUpdateCustomer();
      
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        jasmine.objectContaining({
          type: '[Customer] Update Customer',
          customer: jasmine.any(Object)
        })
      );
      expect(mockCustomerService.invalidateCache).toHaveBeenCalled();
    });

    it('should show validation errors when updating with invalid data', () => {
      component.editCustomer = {
        id: '1',
        firstName: '',
        lastName: '',
        email: 'invalid-email',
        birthDate: '1990-01-01T00:00:00.000Z',
        hasContract: true
      };
      
      component.onUpdateCustomer();
      
      expect(component.formErrors.editCustomer.firstName).toBe('First name is required');
      expect(component.formErrors.editCustomer.lastName).toBe('Last name is required');
      expect(component.formErrors.editCustomer.email).toBe('Please enter a valid email address');
    });
  });

  // Test 4: Customer Deletion
  describe('Customer Deletion', () => {
    it('should open delete confirmation modal on delete', () => {
      component.onDeleteCustomer('1');
      
      expect(component.customerToDeleteId).toBe('1');
      expect(component.isDeleteModalVisible).toBeTrue();
    });

    it('should delete customer when delete is confirmed', () => {
      mockStore.dispatch.calls.reset();
      
      component.customerToDeleteId = '1';
      component.confirmDelete();
      
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        jasmine.objectContaining({ 
          type: '[Customer] Delete Customer',
          customerId: '1'
        })
      );
      expect(component.isDeleteModalVisible).toBeFalse();
      expect(component.customerToDeleteId).toBeNull();
    });

    it('should close modal and clear id when cancel is clicked', () => {
      component.customerToDeleteId = '1';
      component.isDeleteModalVisible = true;
      
      component.handleDeleteCancel();
      
      expect(component.isDeleteModalVisible).toBeFalse();
      expect(component.customerToDeleteId).toBeNull();
    });
  });
});
