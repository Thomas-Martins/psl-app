import ProductInfoModal from "@/components/Intranet/Products/ProductInfoModal";
import { RouteConfig } from "@core/router/RouteConfig.ts";
import ProductsPage from "@pages/ProductsPage.tsx";
import ProductEditModal from "@components/Intranet/Products/ProductEditModal.tsx";

export const productsRoutes = (
    isOpen: boolean,
    onOpenChange: (isOpen: boolean) => void,
): RouteConfig[] => [
    {
        path: "stocks",
        element: <ProductsPage />,
        children: [
            {
                path: ":productId",
                element: (
                    <ProductInfoModal
                        isOpen={isOpen}
                        onOpenChange={onOpenChange}
                    />
                ),
            },
            {
                path: ":productId/edit",
                element: (
                    <ProductEditModal
                        isOpen={isOpen}
                        onOpenChange={onOpenChange}
                    />
                ),
            },
        ],
    },
];
