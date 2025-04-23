import ShopProductsPages from "@pages/ShopPages/ShopProductsPages.tsx";
import ProductModal from "@components/Shop/products/ProductModal.tsx";
import { RouteConfig } from "@core/router/RouteConfig.ts";

export const shopProductsRoutes = (
    isOpen: boolean,
    onOpenChange: (isOpen: boolean) => void,
): RouteConfig[] => [
    {
        path: "products",
        element: <ShopProductsPages />,
        children: [
            {
                path: ":id",
                element: (
                    <ProductModal isOpen={isOpen} onOpenChange={onOpenChange} />
                ),
            },
        ],
    },
];
