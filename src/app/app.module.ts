import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomerComponent } from './component/customer-list/customer.component';
import { CustomerDetailComponent } from './component/customer-detail/customer-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    CustomerComponent,
    CustomerDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
