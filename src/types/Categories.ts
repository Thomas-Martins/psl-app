export interface Category {
    id: string;
    name: string;
    products_count: number;
    image_url: string;
}

export interface PaginatedCategories {
    current_page: number;
    data: Category[];
    per_page: number;
    total: number;
    last_page: number;
}

export interface CategoryProps {
    categories: PaginatedCategories;
}
