export interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    role: string;
    address: string;
    zipcode: string;
    city: string;
}

export interface PaginatedUsers {
    current_page: number;
    data: User[];
    per_page: number;
    total: number;
    last_page: number;
}

export interface UsersProps {
    users: PaginatedUsers;
}
