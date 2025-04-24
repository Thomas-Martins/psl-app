import { JSX } from "react";
import { Navigate, Route, Routes } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "@store/store.ts";
import { useDisclosure } from "@heroui/react";
import LoginPage from "@pages/auth/LoginPage.tsx";
import ShopLayout from "@layouts/ShopLayout/ShopLayout.tsx";
import IntranetLayout from "@layouts/IntranetLayout/IntranetLayout.tsx";
import { Role } from "@/types/Role.ts";
import { commandsRoutes } from "./routes/Commands.routes";
import { customersRoutes } from "./routes/Customers.routes";
import { productsRoutes } from "./routes/Products.routes";
import { usersRoutes } from "./routes/Users.routes";
import { storesRoutes } from "./routes/Stores.routes";
import { suppliersRoutes } from "./routes/Suppliers.routes";
import { carriersRoutes } from "./routes/Carriers.routes";
import { RouteConfig } from "@core/router/RouteConfig.ts";
import { shopProductsRoutes } from "@core/router/routes/shop/ShopProducts.routes.tsx";
import CartLayout from "@layouts/ShopLayout/CartLayout.tsx";
import { cartRoutes } from "@core/router/routes/shop/Cart.routes.tsx";
import CartVerification from "@components/Shop/Cart/CartVerification.tsx";
import { orderRoutes } from "@core/router/routes/shop/Order.routes.tsx";
import OrdersPage from "@pages/ShopPages/OrdersPage.tsx";

function renderRoutes(routeConfigs: RouteConfig[]): JSX.Element[] {
    return routeConfigs.map((route, index) => (
        <Route key={index} path={route.path} element={route.element}>
            {route.children && renderRoutes(route.children)}
        </Route>
    ));
}

export default function AppRoutes() {
    const user = useSelector((state: RootState) => state.user);
    const cartItems = useSelector((s: RootState) => s.cart.items);
    const { isOpen, onOpenChange } = useDisclosure();
    const isAuthenticated = Boolean(user && user.role);

    const isCartConfirmation =
        location.pathname.startsWith("/cart/confirmation");

    const protectedRoutes: RouteConfig[] = [
        ...commandsRoutes,
        ...customersRoutes,
        ...productsRoutes,
        ...usersRoutes,
        ...storesRoutes,
        ...suppliersRoutes(isOpen, onOpenChange),
        ...carriersRoutes(isOpen, onOpenChange),
    ];

    const shopRoutes: RouteConfig[] = [
        ...shopProductsRoutes(isOpen, onOpenChange),
    ];

    return (
        <Routes>
            <Route
                path="/login"
                element={
                    isAuthenticated ? (
                        user?.role === Role.CLIENT ? (
                            <Navigate to="/shop" />
                        ) : (
                            <Navigate to="/commands" />
                        )
                    ) : (
                        <LoginPage />
                    )
                }
            />
            <Route
                path="/shop/*"
                element={
                    user?.role === Role.CLIENT ? (
                        <ShopLayout />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            >
                <Route index element={<Navigate to="products" />} />
                {renderRoutes(shopRoutes)}
            </Route>
            <Route
                path="/cart/*"
                element={
                    user?.role !== Role.CLIENT ? (
                        <Navigate to="/login" replace />
                    ) : !isCartConfirmation && cartItems.length === 0 ? (
                        <Navigate to="/shop" replace />
                    ) : (
                        <CartLayout />
                    )
                }
            >
                <Route index element={<CartVerification />} />
                {renderRoutes(cartRoutes)}
            </Route>
            <Route
                path="/orders/*"
                element={
                    user?.role === Role.CLIENT ? (
                        <CartLayout />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            >
                <Route index element={<OrdersPage />} />
                {renderRoutes(orderRoutes)}
            </Route>
            <Route
                path="/*"
                element={
                    isAuthenticated && user?.role !== Role.CLIENT ? (
                        <IntranetLayout />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            >
                {renderRoutes(protectedRoutes)}
                <Route index element={<Navigate to="commands" />} />
            </Route>
        </Routes>
    );
}
