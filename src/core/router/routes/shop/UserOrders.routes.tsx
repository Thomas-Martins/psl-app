import OrderDetail from "@components/Shop/Cart/OrderDetail.tsx";
import OrdersPage from "@pages/ShopPages/OrdersPage.tsx";

export const userOrderRoutes = [
    {
        path: "",
        element: <OrdersPage />,
    },
    {
        path: ":orderId",
        element: <OrderDetail />,
    },
];
