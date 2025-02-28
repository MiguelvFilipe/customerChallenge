import { NgModule,isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomerComponent } from './component/customer-list/customer.component';
import { CustomerDetailComponent } from './component/customer-detail/customer-detail.component';


import { StoreModule } from '@ngrx/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { appReducer } from './store/reducers/customers.reducer';
import { HttpClientModule } from '@angular/common/http';
import { EffectsModule } from "@ngrx/effects";
import { AppEffects } from './store/effects/customers.effects';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';


registerLocaleData(en);
@NgModule({
  declarations: [
    AppComponent,
    CustomerComponent,
    CustomerDetailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({ app: appReducer }),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    StoreDevtoolsModule.instrument({ maxAge: false, logOnly: !isDevMode() }),
    EffectsModule.forRoot([AppEffects]),
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: NZ_I18N, useValue: en_US }
  ]
})
export class AppModule { }
