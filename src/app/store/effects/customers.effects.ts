import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { CustomerService } from "../../services/customer.service";
import { loadAppData, loadAppDataFail, loadAppDataSuccess } from "../actions/customers.actions";
import { catchError, map, exhaustMap, of, mergeMap } from "rxjs";


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

 
}
