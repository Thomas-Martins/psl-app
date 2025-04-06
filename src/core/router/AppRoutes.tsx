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

function renderRoutes(routeConfigs: RouteConfig[]): JSX.Element[] {
    return routeConfigs.map((route, index) => (
        <Route key={index} path={route.path} element={route.element}>
            {route.children && renderRoutes(route.children)}
        </Route>
    ));
}

export default function AppRoutes() {
    const user = useSelector((state: RootState) => state.user);
    const { isOpen, onOpenChange } = useDisclosure();
    const isAuthenticated = Boolean(user && user.role);

    // Combiner toutes les routes protégées
    const protectedRoutes: RouteConfig[] = [
        ...commandsRoutes,
        ...customersRoutes,
        ...productsRoutes,
        ...usersRoutes,
        ...storesRoutes,
        ...suppliersRoutes,
        ...carriersRoutes(isOpen, onOpenChange),
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
                path="/shop"
                element={
                    user?.role === Role.CLIENT ? (
                        <ShopLayout />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />
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
