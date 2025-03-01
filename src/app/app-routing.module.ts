import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './pages/customer-list/customer.component';

const routes: Routes = [
  { path: "", redirectTo: "/customer", pathMatch: "full" },
  { path: "customer", component: CustomerComponent },
  { path: "**", redirectTo: "/customer" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }