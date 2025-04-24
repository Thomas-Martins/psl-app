import CartVerification from "@components/Shop/cart/CartVerification.tsx";
import CartConfirmation from "@components/Shop/cart/CartConfirmation.tsx";

export const cartRoutes = [
    {
        path: "",
        element: <CartVerification />,
    },
    {
        path: "confirmation",
        element: <CartConfirmation />,
    },
];
