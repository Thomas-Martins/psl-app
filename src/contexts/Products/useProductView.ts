import { useContext } from "react";
import { ProductViewContext } from "./ProductViewContextInstance";

export const useProductView = () => {
    const context = useContext(ProductViewContext);
    if (!context) {
        throw new Error(
            "useProductView must be used within a ProductViewProvider",
        );
    }
    return context;
};
