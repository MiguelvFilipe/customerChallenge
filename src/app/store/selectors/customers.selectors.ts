import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppState } from "../reducers/customers.reducer";

const getAppState = createFeatureSelector<AppState>('app');

export const getCustomerList = createSelector(getAppState, (state) => state.customerList);
export const getErrorMessage = createSelector(getAppState, (state) => state.errorMessage);
export const getLoadingState = createSelector(getAppState, (state) => state.isLoading);
