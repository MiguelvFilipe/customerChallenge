import { createReducer, on } from "@ngrx/store";
import { loadAppData, loadAppDataSuccess, loadAppDataFail, setLoadingState} from "../actions/customers.actions";
import { CustomerModel } from "../../models/customer.model";

export interface AppState {
    customerList: CustomerModel[];
    errorMessage: string;
    isLoading: boolean; // Add loading state
    selectedCustomerId: string | null;
}

export const initialState: AppState = {
    customerList: [],
    errorMessage: '',
    isLoading: false, // Initialize loading state
    selectedCustomerId: null,
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
);

export function appReducer(state: any, action: any) {
    return _appReducer(state, action);
}
