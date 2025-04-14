import { RouteConfig } from "@core/router/RouteConfig.ts";
import ProductsPage from "@pages/ProductsPage.tsx";

export const productsRoutes: RouteConfig[] = [
    {
        path: "products",
        element: <ProductsPage />,
    },
];
