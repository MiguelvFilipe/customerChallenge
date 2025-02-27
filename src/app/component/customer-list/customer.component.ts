import { Component, OnInit} from '@angular/core';
import { loadAppData } from '../../store/actions/customers.actions';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CustomersListModel } from 'src/app/models/customer.model';
import { Subject, takeUntil } from 'rxjs';
import { getCustomerList, getLoadingState } from '../../store/selectors/customers.selectors';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerList: CustomersListModel = { customerList: [], Errormessage: '', loading: true }; 
  isLoading!: boolean;
  private unsubscribe$ = new Subject<void>();
  
  constructor(
    private store: Store,
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
  }
}
