import OrderDetail from "@components/Shop/Cart/OrderDetail.tsx";
import OrdersPage from "@pages/ShopPages/OrdersPage.tsx";

export const orderRoutes = [
    {
        path: "orders",
        element: <OrdersPage />,
    },
    {
        path: ":orderId",
        element: <OrderDetail />,
    },
];
