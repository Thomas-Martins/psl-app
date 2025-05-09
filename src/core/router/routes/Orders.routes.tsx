import OrdersPage from "@pages/Orders/OrdersPage.tsx";
import { RouteConfig } from "../RouteConfig.ts";
import OrderDetailsPage from "@pages/Orders/OrderdetailsPage.tsx";

export const ordersRoutes: RouteConfig[] = [
    {
        path: "orders",
        element: <OrdersPage />,
        children: [
            {
                path: ":id",
                element: <OrderDetailsPage />,
            },
        ],
    },
];
