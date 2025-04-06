import { RouteConfig } from "@core/router/RouteConfig.ts";
import SuppliersPage from "@pages/SuppliersPage.tsx";

export const suppliersRoutes: RouteConfig[] = [
    {
        path: "suppliers",
        element: <SuppliersPage />,
    },
];
