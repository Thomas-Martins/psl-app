import { Product } from "@/types/Products.ts";
import { OrderStatus } from "@/types/OrderStatus.ts";

export interface Order {
    id: string;
    reference: string;
    userId: string;
    status: OrderStatus;
    total_price: number;
    products: Product[];
    createdAt: string;
    updatedAt: string;
}
