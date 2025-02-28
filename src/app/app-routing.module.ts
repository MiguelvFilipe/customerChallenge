import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './pages/customer-list/customer.component';
import { CustomerDetailComponent } from './pages/customer-detail/customer-detail.component';

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