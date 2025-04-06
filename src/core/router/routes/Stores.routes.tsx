import { RouteConfig } from "@core/router/RouteConfig.ts";
import StoresPage from "@pages/StoresPage.tsx";

export const storesRoutes: RouteConfig[] = [
    {
        path: "stores",
        element: <StoresPage />,
    },
];
