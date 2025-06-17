export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image_url?: string;
}

export interface CartState {
    items: CartItem[];
    totalPrice: number;
}
