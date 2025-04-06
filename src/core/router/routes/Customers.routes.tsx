import CustomersPage from "@pages/CustomersPage.tsx";
import { RouteConfig } from "../RouteConfig.ts";

export const customersRoutes: RouteConfig[] = [
    {
        path: "clients",
        element: <CustomersPage />,
    },
];
