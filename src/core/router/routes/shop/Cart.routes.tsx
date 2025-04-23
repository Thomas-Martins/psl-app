import CartConfirmation from "@components/Shop/cart/CartConfirmation.tsx";

export const cartRoutes = [
    {
        path: "",
        element: <CartConfirmation />,
    },
    {
        path: "confirmation",
        element: <CartConfirmation />,
    },
];
