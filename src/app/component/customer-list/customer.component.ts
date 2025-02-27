import { Component, OnInit} from '@angular/core';
import { loadAppData } from '../../store/actions/customers.actions';
import { getLoadingState } from '../../store/selectors/customers.selectors';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  isLoading!: boolean;

  
  constructor(
    private store: Store,
    private router: Router,

  ) {}

  ngOnInit(): void {

      this.store.dispatch(loadAppData());

      this.store.select(getLoadingState).subscribe(isLoading => {
        this.isLoading = isLoading;
        console.log('Loading state:', isLoading);
      });
  }

  

}
