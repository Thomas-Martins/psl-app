import { Product } from "@/types/Products.ts";
import { OrderStatus } from "@/types/OrderStatus.ts";
import { User } from "@/types/Users.ts";

export interface Order {
    id: number;
    reference: string;
    userId: string;
    status: OrderStatus;
    total_price: number;
    products: Product[];
    estimated_delivery_date: string;
    user: User;
    total_quantity?: number;
    invoiced: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface PaginatedOrders {
    current_page: number;
    data: Order[];
    per_page: number;
    total: number;
    last_page: number;
    status?: OrderStatus[];
}
export interface OrdersProps {
    orders: PaginatedOrders;
}
