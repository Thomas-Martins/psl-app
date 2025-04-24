import { Product } from "@/types/Products.ts";

export interface Order {
    id: string;
    reference: string;
    userId: string;
    status: string;
    total_price: number;
    products: Product[];
    createdAt: string;
    updatedAt: string;
}
