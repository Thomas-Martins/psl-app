export interface Store {
    id: number;
    name: string;
    address: string;
    zipcode: string;
    city: string;
    phone: string;
    email: string;
    customers_count: number;
}

export interface PaginatedStores {
    current_page: number;
    data: Store[];
    per_page: number;
    total: number;
    last_page: number;
}

export interface StoresProps {
    stores: PaginatedStores;
}
