export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image_url?: string;
}

export interface CartState {
    items: CartItem[];
    totalPrice: number;
}
