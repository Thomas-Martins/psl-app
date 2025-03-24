export interface Carrier {
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
    image_url: string;
}

export interface PaginatedCarriers {
    current_page: number;
    data: Carrier[];
    per_page: number;
    total: number;
    last_page: number;
}

export interface CarriersProps {
    carriers: PaginatedCarriers;
}
