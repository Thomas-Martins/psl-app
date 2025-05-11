export interface Store {
    id: number;
    name: string;
    address: string;
    zipcode: string;
    city: string;
    phone: string;
    email: string;
    customers_count: number;
    image_url: string;
    full_address: string;
    siret: string;
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
