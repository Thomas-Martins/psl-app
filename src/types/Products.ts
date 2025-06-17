export interface Product {
    id: string;
    name: string;
    description: string;
    reference: string;
    location: string;
    category: {
        id: string;
        name: string;
    };
    supplier: {
        id: string;
        name: string;
    };
    price: number;
    stock: number;
    image_url: string;
    quantity?: number;
}

export interface PaginatedProducts {
    current_page: number;
    data: Product[];
    per_page: number;
    total: number;
    last_page: number;
}

export interface ProductsProps {
    products: PaginatedProducts;
}
