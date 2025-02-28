export interface CustomerModel {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    birthDate?: string;
    avatar: string;
    hasContract: boolean;
  }

export interface CustomersListModel {
    customerList: CustomerModel[];
    Errormessage: string;
    loading: boolean;
  }