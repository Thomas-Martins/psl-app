import { Order } from "./Orders";

export interface Customer {
    id: number;
    firstname: string;
    lastname: string;
    identity: string;
    email: string;
    phone: string;
    full_address: string;
    address: string;
    zipcode: string;
    city: string;
    email_verified_at: string;
    store: {
        id: number;
        name: string;
    };
    orders_count: number;
    orders: Order[];
}

export interface PaginatedCustomers {
    current_page: number;
    data: Customer[];
    per_page: number;
    total: number;
    last_page: number;
}

export interface CustomersProps {
    customers: PaginatedCustomers;
}
