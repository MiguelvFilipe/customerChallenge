import { createReducer, on } from "@ngrx/store";
import { loadAppData, loadAppDataSuccess, loadAppDataFail, setLoadingState, loadCustomerDetails, loadCustomerDetailsSuccess, loadCustomerDetailsFail, searchCustomers, searchCustomersSuccess, searchCustomersFail } from "../actions/customers.actions";
import { CustomerModel } from "../../models/customer.model";

export interface AppState {
    customerList: CustomerModel[];
    errorMessage: string;
    isLoading: boolean; 
    selectedCustomerId: string | null;
    selectedCustomer: CustomerModel | null;
}

export const initialState: AppState = {
    customerList: [],
    errorMessage: '',
    isLoading: false,
    selectedCustomerId: null,
    selectedCustomer: null,
};

const _appReducer = createReducer(
    initialState,
    on(setLoadingState, (state, action) => ({
        ...state,
        isLoading: action.isLoading
    })),
    on(loadAppData, (state) => ({
        ...state,
        isLoading: true
    })),
    on(loadAppDataSuccess, (state, action) => ({
        ...state,
        customerList: action.customerList,
        errorMessage: '',
        isLoading: false
    })),
    on(loadAppDataFail, (state, action) => ({
        ...state,
        errorMessage: action.error,
        isLoading: false
    })),
    on(loadCustomerDetails, (state) => ({
        ...state,
        isLoading: true,
        selectedCustomer: null
    })),
    on(loadCustomerDetailsSuccess, (state, action) => ({
        ...state,
        selectedCustomer: action.customer,
        isLoading: false
    })),
    on(loadCustomerDetailsFail, (state, action) => ({
        ...state,
        errorMessage: action.error,
        isLoading: false
    })),
    on(searchCustomers, (state) => ({
        ...state,
        isLoading: true,
        customerList: []
    })),
    on(searchCustomersSuccess, (state, action) => ({
        ...state,
        customerList: action.customerList,
        isLoading: false
    })),
    on(searchCustomersFail, (state, action) => ({
        ...state,
        errorMessage: action.error,
        isLoading: false
    })),
);

export function appReducer(state: any, action: any) {
    return _appReducer(state, action);
}
