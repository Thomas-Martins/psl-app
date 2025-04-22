import { createContext, useContext } from "react";

export type ProductFilters = {
    search?: string;
    categories?: string[];
    priceRange?: number[];
};

type ProductFiltersContextType = {
    filters: ProductFilters;
    setFilters: (filters: ProductFilters) => void;
};

export const ProductFiltersContext =
    createContext<ProductFiltersContextType | null>(null);

export const useProductFilters = () => {
    const ctx = useContext(ProductFiltersContext);
    if (!ctx)
        throw new Error(
            "useProductFilters must be used inside ProductFiltersProvider",
        );
    return ctx;
};
