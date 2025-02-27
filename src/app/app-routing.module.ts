import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './component/customer-list/customer.component';
import { CustomerDetailComponent } from './component/customer-detail/customer-detail.component';

const routes: Routes = [
  { path: "", redirectTo: "/customer", pathMatch: "full" },
  { path: "customer", component: CustomerComponent },
  { path: "customer/:id", component: CustomerDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }