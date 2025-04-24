import CartVerification from "@components/Shop/Cart/CartVerification.tsx";
import CartConfirmation from "@components/Shop/Cart/CartConfirmation.tsx";

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
