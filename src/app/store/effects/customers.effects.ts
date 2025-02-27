import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { CustomerService } from "../../services/customer.service";
import { loadAppData, loadAppDataFail, loadAppDataSuccess, loadCustomerDetails, loadCustomerDetailsFail, loadCustomerDetailsSuccess, searchCustomers, searchCustomersSuccess, searchCustomersFail } from "../actions/customers.actions";
import { catchError, map, exhaustMap, of, mergeMap } from "rxjs";
import { filter } from 'rxjs/operators';
import { CustomerModel } from "../../models/customer.model";

@Injectable()
export class AppEffects {
    constructor(private actions$: Actions, private service: CustomerService) {}

    loadAppData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadAppData),
            exhaustMap(action =>
                this.service.GetAllCustomers(action.page, action.limit).pipe(
                    map((data) => loadAppDataSuccess({ customerList: data })),
                    catchError((error) => of(loadAppDataFail({ error })))
                )
            )
        )
    );

    loadCustomerDetails$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadCustomerDetails),
            mergeMap(action =>
                this.service.GetCustomerById(action.customerId).pipe(
                    map((customer) => {
                        if (customer) {
                            return loadCustomerDetailsSuccess({ customer });
                        } else {
                            return loadCustomerDetailsFail({ error: 'Customer not found' });
                        }
                    }),
                    catchError((error) => of(loadCustomerDetailsFail({ error })))
                )
            )
        )
    );

    searchCustomers$ = createEffect(() =>
        this.actions$.pipe(
            ofType(searchCustomers),
            mergeMap(action =>
                this.service.SearchCustomers(action.query, action.searchType).pipe(
                    map((customerList) => searchCustomersSuccess({ customerList })),
                    catchError((error) => of(searchCustomersFail({ error })))
                )
            )
        )
    );
}
