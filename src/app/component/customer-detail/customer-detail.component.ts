import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { CustomerModel } from '../../models/customer.model';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css']
})
export class CustomerDetailComponent implements OnInit {
  customer: CustomerModel | null = null;
  errorMessage: string | null = null;
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    const customerId = this.route.snapshot.paramMap.get('id');
    if (customerId) {
      this.isLoading = true;
      this.customerService.GetAllCustomers(1, 10).subscribe(customers => {
        this.customer = customers.find(c => c.id === customerId) || null;
        this.isLoading = false;
      }, error => {
        this.errorMessage = 'Failed to load customer details';
        this.isLoading = false;
      });
    }
  }
}