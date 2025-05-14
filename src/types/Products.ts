export interface Product {
    id: number;
    name: string;
    description: string;
    reference: string;
    location: string;
    category: {
        id: number;
        name: string;
    };
    supplier: {
        id: number;
        name: string;
    };
    price: number;
    stock: number;
    image_url: string;
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
