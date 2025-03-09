export interface Supplier {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    zipcode: string;
    city: string;
    contact_person_email: string;
    contact_person_firstname: string;
    contact_person_lastname: string;
    contact_person_phone: string;
    country: string;
}

export interface PaginatedSuppliers {
    current_page: number;
    data: Supplier[];
    per_page: number;
    total: number;
    last_page: number;
}

export interface SuppliersProps {
    suppliers: PaginatedSuppliers;
}
