import { createAction, props } from "@ngrx/store";
import { CustomerModel } from "../../models/customer.model";

// Define global actions
export const LOAD_APP_DATA = '[App] Load App Data';
export const LOAD_APP_DATA_SUCCESS = '[App] Load App Data Success';
export const LOAD_APP_DATA_FAIL = '[App] Load App Data Fail';
export const SET_LOADING_STATE = '[App] Set Loading State';

export const LOAD_CUSTOMER_DETAILS = '[Customer] Load Customer Details';
export const LOAD_CUSTOMER_DETAILS_SUCCESS = '[Customer] Load Customer Details Success';
export const LOAD_CUSTOMER_DETAILS_FAIL = '[Customer] Load Customer Details Fail';

export const SEARCH_CUSTOMERS = '[Customer] Search Customers';
export const SEARCH_CUSTOMERS_SUCCESS = '[Customer] Search Customers Success';
export const SEARCH_CUSTOMERS_FAIL = '[Customer] Search Customers Fail';

export const DELETE_CUSTOMER = '[Customer] Delete Customer';
export const DELETE_CUSTOMER_SUCCESS = '[Customer] Delete Customer Success';
export const DELETE_CUSTOMER_FAIL = '[Customer] Delete Customer Fail';

export const CREATE_CUSTOMER = '[Customer] Create Customer';
export const CREATE_CUSTOMER_SUCCESS = '[Customer] Create Customer Success';
export const CREATE_CUSTOMER_FAIL = '[Customer] Create Customer Fail';

export const UPDATE_CUSTOMER = '[Customer] Update Customer';
export const UPDATE_CUSTOMER_SUCCESS = '[Customer] Update Customer Success';
export const UPDATE_CUSTOMER_FAIL = '[Customer] Update Customer Fail';

// Actions
export const loadAppData = createAction(LOAD_APP_DATA, props<{ page: number, limit: number }>());
export const loadAppDataSuccess = createAction(LOAD_APP_DATA_SUCCESS, props<{ customerList: CustomerModel[] }>());
export const loadAppDataFail = createAction(LOAD_APP_DATA_FAIL, props<{ error: any }>());
export const setLoadingState = createAction(SET_LOADING_STATE, props<{ isLoading: boolean }>());

export const loadCustomerDetails = createAction(LOAD_CUSTOMER_DETAILS, props<{ customerId: string }>());
export const loadCustomerDetailsSuccess = createAction(LOAD_CUSTOMER_DETAILS_SUCCESS, props<{ customer: CustomerModel }>());
export const loadCustomerDetailsFail = createAction(LOAD_CUSTOMER_DETAILS_FAIL, props<{ error: any }>());

export const searchCustomers = createAction(SEARCH_CUSTOMERS, props<{ query: string, searchType: 'firstName' | 'lastName' }>());
export const searchCustomersSuccess = createAction(SEARCH_CUSTOMERS_SUCCESS, props<{ customerList: CustomerModel[] }>());
export const searchCustomersFail = createAction(SEARCH_CUSTOMERS_FAIL, props<{ error: any }>());

export const deleteCustomer = createAction(DELETE_CUSTOMER, props<{ customerId: string }>());
export const deleteCustomerSuccess = createAction(DELETE_CUSTOMER_SUCCESS, props<{ customerId: string }>());
export const deleteCustomerFail = createAction(DELETE_CUSTOMER_FAIL, props<{ error: any }>());

export const createCustomer = createAction(CREATE_CUSTOMER, props<{ customer: Partial<CustomerModel> }>());
export const createCustomerSuccess = createAction(CREATE_CUSTOMER_SUCCESS, props<{ customer: CustomerModel }>());
export const createCustomerFail = createAction(CREATE_CUSTOMER_FAIL, props<{ error: any }>());

export const updateCustomer = createAction(UPDATE_CUSTOMER, props<{ customer: Partial<CustomerModel> }>());
export const updateCustomerSuccess = createAction(UPDATE_CUSTOMER_SUCCESS, props<{ customer: CustomerModel }>());
export const updateCustomerFail = createAction(UPDATE_CUSTOMER_FAIL, props<{ error: any }>());

