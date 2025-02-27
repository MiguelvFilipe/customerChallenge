import { createAction, props } from "@ngrx/store";
import { CustomerModel } from "../../models/customer.model";

// Define global actions
export const LOAD_APP_DATA = '[App] Load App Data';
export const LOAD_APP_DATA_SUCCESS = '[App] Load App Data Success';
export const LOAD_APP_DATA_FAIL = '[App] Load App Data Fail';
export const SET_LOADING_STATE = '[App] Set Loading State';


// Actions
export const loadAppData = createAction(LOAD_APP_DATA, props<{ page: number, limit: number }>());
export const loadAppDataSuccess = createAction(LOAD_APP_DATA_SUCCESS, props<{ customerList: CustomerModel[] }>());
export const loadAppDataFail = createAction(LOAD_APP_DATA_FAIL, props<{ error: any }>());
export const setLoadingState = createAction(SET_LOADING_STATE, props<{ isLoading: boolean }>());

