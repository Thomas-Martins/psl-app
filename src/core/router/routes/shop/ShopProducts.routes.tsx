import ShopProductsPages from "@pages/ShopPages/ShopProductsPages.tsx";
import ProductModal from "@components/Shop/Products/ProductModal.tsx";
import { RouteConfig } from "@core/router/RouteConfig.ts";
import CategoriesPage from "@pages/ShopPages/Categories/CategoriesPage.tsx";
import CategoryShowPage from "@pages/ShopPages/Categories/CategoryShowPage.tsx";

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
    {
        path: "categories",
        element: <CategoriesPage />,
    },
    {
        path: "categories/:categoryId/products",
        element: <CategoryShowPage />,
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
