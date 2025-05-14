import { createContext, useContext } from "react";
import { PaginatedProducts } from "@/types/Products";

interface ProductsContextType {
    mutate: () => Promise<PaginatedProducts | undefined>;
}

export const ProductsContext = createContext<ProductsContextType | undefined>(
    undefined,
);

export const useProducts = () => {
    const context = useContext(ProductsContext);
    if (!context) {
        throw new Error("useProducts must be used within a ProductsProvider");
    }
    return context;
};
