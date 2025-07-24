import { useState } from "react";
import {
    ProductViewContext,
    ProductViewType,
} from "./ProductViewContextInstance";

export function ProductViewProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [view, setView] = useState<ProductViewType>("grid");
    return (
        <ProductViewContext.Provider value={{ view, setView }}>
            {children}
        </ProductViewContext.Provider>
    );
}
