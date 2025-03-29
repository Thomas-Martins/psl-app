import { Role } from "@/types/Role.ts";

export interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    role: Role;
    address: string;
    zipcode: string;
    city: string;
    identity: string;
    image_url: string;
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
