export interface Customer {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    address: string;
    zipcode: string;
    city: string;
    email_verified_at: string;
    store: {
        id: number;
        name: string;
    };
    commands_count: number;
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
