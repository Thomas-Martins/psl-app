import { createContext } from "react";

export type ProductViewType = "grid" | "list";

export interface ProductViewContextType {
    view: ProductViewType;
    setView: (view: ProductViewType) => void;
}

export const ProductViewContext = createContext<
    ProductViewContextType | undefined
>(undefined);
