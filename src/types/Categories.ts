export interface Category {
    id: number;
    name: string;
    products_count: number;
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
